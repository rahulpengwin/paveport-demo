import { describe, it, expect, beforeEach } from 'vitest';
import { useDemoStore } from '@/stores/useDemoStore';
import { hasPermission } from '@/lib/permissions/rbac';

describe('PavePort Domain State & RBAC Logic', () => {
  beforeEach(() => {
    useDemoStore.getState().resetDemoData();
  });

  describe('RBAC & Permissions', () => {
    it('SUPER_ADMIN possesses full administrative scopes', () => {
      expect(hasPermission('SUPER_ADMIN', 'dashboard.read')).toBe(true);
      expect(hasPermission('SUPER_ADMIN', 'businesses.approve')).toBe(true);
      expect(hasPermission('SUPER_ADMIN', 'roles.manage')).toBe(true);
      expect(hasPermission('SUPER_ADMIN', 'deliveries.assign')).toBe(true);
    });

    it('CUSTOMER role cannot approve businesses or manage roles', () => {
      expect(hasPermission('CUSTOMER', 'businesses.approve')).toBe(false);
      expect(hasPermission('CUSTOMER', 'roles.manage')).toBe(false);
      expect(hasPermission('CUSTOMER', 'products.read')).toBe(true);
    });

    it('BUSINESS_VERIFICATION_ADMIN can approve businesses but cannot dispatch deliveries', () => {
      expect(hasPermission('BUSINESS_VERIFICATION_ADMIN', 'businesses.approve')).toBe(true);
      expect(hasPermission('BUSINESS_VERIFICATION_ADMIN', 'deliveries.assign')).toBe(false);
    });
  });

  describe('Business Approval & Catalog Lifecycle', () => {
    it('approves a pending business and generates audit log', () => {
      const store = useDemoStore.getState();
      const pendingBiz = store.businesses.find((b) => b.verificationStatus === 'PENDING');
      expect(pendingBiz).toBeDefined();

      if (pendingBiz) {
        store.approveBusiness(pendingBiz.id, 'Verified legal documents');
        const updated = useDemoStore.getState().businesses.find((b) => b.id === pendingBiz.id);
        expect(updated?.verificationStatus).toBe('APPROVED');

        const audit = useDemoStore.getState().auditLogs.find((l) => l.targetId === pendingBiz.id);
        expect(audit).toBeDefined();
        expect(audit?.action).toBe('BUSINESS_APPROVAL');
      }
    });

    it('creates new product and manages inventory adjustments', () => {
      const store = useDemoStore.getState();
      const product = store.addProduct({
        businessId: 'biz-lakshmi',
        businessName: 'Sri Lakshmi Cement',
        name: 'Test OPC Cement 53',
        categoryId: 'cat-cement',
        categoryName: 'Cement & Binders',
        brand: 'UltraTech',
        gradeSpecification: 'IS 269:2015',
        unit: 'Bags (50kg)',
        pricePerUnit: 390,
        minOrderQty: 25,
        availableStock: 500,
        reservedStock: 0,
        lowStockThreshold: 50,
        imageUrl: '/test.jpg',
        handlingNotes: 'Dry storage',
        isArchived: false,
      });

      expect(product.id).toBeDefined();
      expect(product.pricePerUnit).toBe(390);

      // Adjust stock (+100)
      store.adjustInventory(product.id, 100, 'Inbound shipment');
      const updated = useDemoStore.getState().products.find((p) => p.id === product.id);
      expect(updated?.availableStock).toBe(600);
    });
  });

  describe('Quotation & Order Lifecycle', () => {
    it('customer requests quote, business responds, customer accepts and order is created', () => {
      const store = useDemoStore.getState();

      // Step A: Customer requests quote
      const quote = store.submitQuotationRequest({
        businessId: 'biz-lakshmi',
        items: [{ productId: 'prod-ultratech-53', requestedQty: 100 }],
        notes: 'Ground floor slab drop',
      });

      expect(quote.status).toBe('SUBMITTED');
      expect(quote.items[0].requestedQty).toBe(100);

      // Step B: Business responds with rate and transport fee
      store.respondToQuotation(quote.id, {
        quotedUnitPrice: 380,
        deliveryCharges: 1200,
        taxCharges: 6840,
        validityDays: 7,
      });

      const respondedQuote = useDemoStore.getState().quotations.find((q) => q.id === quote.id);
      expect(respondedQuote?.status).toBe('REVIEWED_AND_QUOTED');
      expect(respondedQuote?.subtotal).toBe(38000);
      expect(respondedQuote?.totalEstimatedAmount).toBe(46040);

      // Step C: Customer accepts quote -> Order created
      const order = store.acceptQuotation(quote.id);
      expect(order.status).toBe('PLACED');
      expect(order.totalAmount).toBe(46040);
      expect(order.deliveryOtp).toBe('4829');

      // Verify stock was reserved
      const prod = useDemoStore.getState().products.find((p) => p.id === 'prod-ultratech-53');
      expect(prod?.reservedStock).toBeGreaterThan(0);
    });
  });

  describe('Delivery Haulage & OTP Verification', () => {
    it('business stages dispatch, driver accepts, and completes delivery with valid OTP', () => {
      const store = useDemoStore.getState();
      
      // Step A: Create and accept a quote to generate a clean fresh order
      const quote = store.submitQuotationRequest({
        businessId: 'biz-lakshmi',
        items: [{ productId: 'prod-acc-ppc', requestedQty: 50 }],
      });
      store.respondToQuotation(quote.id, {
        quotedUnitPrice: 370,
        deliveryCharges: 800,
        taxCharges: 3330,
        validityDays: 5,
      });
      const order = store.acceptQuotation(quote.id);
      expect(order.status).toBe('PLACED');

      // Step B: Business accepts and marks ready for dispatch
      store.acceptOrder(order.id);
      store.markOrderReadyForDispatch(order.id);
      const updatedOrder = useDemoStore.getState().orders.find((o) => o.id === order.id);
      expect(updatedOrder?.status).toBe('READY_FOR_DISPATCH');

      // Step C: Verify an available assignment was created
      const asn = useDemoStore.getState().deliveryAssignments.find((a) => a.orderId === order.id);
      expect(asn).toBeDefined();
      expect(asn?.status).toBe('AVAILABLE');

      if (asn) {
        // Step D: Driver accepts
        const accepted = store.acceptDeliveryJob(asn.id, 'driver-murugan');
        expect(accepted).toBe(true);

        // Step E: Driver confirms pickup
        store.confirmDeliveryPickup(asn.id);
        expect(useDemoStore.getState().orders.find((o) => o.id === order.id)?.status).toBe('PICKED_UP');

        // Step F: Driver marks in transit
        store.markDeliveryInTransit(asn.id);
        expect(useDemoStore.getState().orders.find((o) => o.id === order.id)?.status).toBe('IN_TRANSIT');

        // Step G: Invalid OTP fails
        const badResult = store.completeDelivery(asn.id, '9999');
        expect(badResult.success).toBe(false);

        // Step H: Valid OTP succeeds
        const goodResult = store.completeDelivery(asn.id, '4829');
        expect(goodResult.success).toBe(true);

        expect(useDemoStore.getState().orders.find((o) => o.id === order.id)?.status).toBe('DELIVERED');
      }
    });
  });
});
