'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  AuditLog,
  Business,
  Cart,
  CartItem,
  CustomerProfile,
  DeliveryAssignment,
  DeliveryPartnerProfile,
  InventoryMovement,
  NotificationItem,
  Order,
  OrderStatus,
  Product,
  ProductCategory,
  Quotation,
  ServiceLocation,
  UserRole,
} from '@/types';
import {
  SEED_AUDIT_LOGS,
  SEED_BUSINESSES,
  SEED_CATEGORIES,
  SEED_CUSTOMERS,
  SEED_DELIVERY_ASSIGNMENTS,
  SEED_DELIVERY_PARTNERS,
  SEED_LOCATIONS,
  SEED_NOTIFICATIONS,
  SEED_ORDERS,
  SEED_PRODUCTS,
  SEED_QUOTATIONS,
} from '@/lib/demo/seed-data';

export interface DemoWorkflowStep {
  stepNumber: number;
  title: string;
  actor: 'ADMIN' | 'BUSINESS' | 'CUSTOMER' | 'DELIVERY';
  route: string;
  description: string;
  actionHint: string;
  isComplete: boolean;
}

export const DEMO_WORKFLOW_STEPS: DemoWorkflowStep[] = [
  {
    stepNumber: 1,
    title: 'Review & Approve New Supplier',
    actor: 'ADMIN',
    route: '/admin/businesses',
    description: 'DecoRock Precast has submitted an onboarding application with GSTIN & Municipal Trade Permit.',
    actionHint: 'Click "Approve" on DecoRock Precast to verify their credentials and grant marketplace access.',
    isComplete: false,
  },
  {
    stepNumber: 2,
    title: 'Configure Store Products & Inventory',
    actor: 'BUSINESS',
    route: '/business/products',
    description: 'Switch to the Business App as Sri Lakshmi Cement to manage pricing, MOQ, and stock levels.',
    actionHint: 'Inspect UltraTech Cement stock or adjust inventory levels in the inventory management tab.',
    isComplete: false,
  },
  {
    stepNumber: 3,
    title: 'Customer Discovery & Quotation Request',
    actor: 'CUSTOMER',
    route: '/customer/stores',
    description: 'Customer Ramesh Kumar (InfraBuild) discovers approved local suppliers in Bengaluru.',
    actionHint: 'Select Sri Lakshmi Cement, add materials to cart, and request a formal commercial quotation.',
    isComplete: false,
  },
  {
    stepNumber: 4,
    title: 'Business Evaluates & Sends Quotation',
    actor: 'BUSINESS',
    route: '/business/quotations',
    description: 'Supplier reviews requested bulk quantities, adjusts unit rate, specifies delivery charges & tax.',
    actionHint: 'Open the pending quotation PV-QT-2026-0042, review line items, and click "Submit Official Quote".',
    isComplete: false,
  },
  {
    stepNumber: 5,
    title: 'Customer Accepts Quote & Creates Order',
    actor: 'CUSTOMER',
    route: '/customer/quotations',
    description: 'Customer compares the revised bulk quote, checks delivery terms, and accepts the quotation.',
    actionHint: 'Click "Accept Quotation" to automatically convert the quote into live Order PV-ORD-2026-8003.',
    isComplete: false,
  },
  {
    stepNumber: 6,
    title: 'Business Prepares & Dispatches Order',
    actor: 'BUSINESS',
    route: '/business/orders',
    description: 'Warehouse supervisor accepts the new order, reserves stock, and marks it ready for haulage.',
    actionHint: 'Click "Accept Order", then "Mark Ready for Dispatch" to broadcast the job to delivery partners.',
    isComplete: false,
  },
  {
    stepNumber: 7,
    title: 'Delivery Partner Accepts Haulage Job',
    actor: 'DELIVERY',
    route: '/delivery/available-jobs',
    description: 'Delivery partner Murugan Selvam (Tata Ace 1.25T) sees the pickup request in his service zone.',
    actionHint: 'Click "Accept Delivery" to claim the haulage assignment.',
    isComplete: false,
  },
  {
    stepNumber: 8,
    title: 'Pickup & Job Site OTP Delivery Completion',
    actor: 'DELIVERY',
    route: '/delivery/active-delivery',
    description: 'Driver confirms pickup at vendor warehouse, transitions to In-Transit, and enters customer OTP.',
    actionHint: 'Click "Confirm Warehouse Pickup", then use demo OTP (4829) to complete the delivery.',
    isComplete: false,
  },
  {
    stepNumber: 9,
    title: 'Synchronized Operational Visibility',
    actor: 'ADMIN',
    route: '/admin/overview',
    description: 'Central platform control plane updates all metrics, revenue volume, and immutable audit logs.',
    actionHint: 'Review updated GMV, live order fulfillment status, and the complete tamper-evident audit trail.',
    isComplete: false,
  },
];

interface DemoState {
  // Active demo context
  currentRole: UserRole;
  activeBusinessId: string;
  activeCustomerId: string;
  activeDeliveryPartnerId: string;
  currentDemoStep: number;
  guidedTourOpen: boolean;

  // Domain data
  businesses: Business[];
  products: Product[];
  categories: ProductCategory[];
  inventoryMovements: InventoryMovement[];
  customers: CustomerProfile[];
  deliveryPartners: DeliveryPartnerProfile[];
  quotations: Quotation[];
  orders: Order[];
  deliveryAssignments: DeliveryAssignment[];
  locations: ServiceLocation[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  cart: Cart;

  // Actions - Admin
  setCurrentRole: (role: UserRole) => void;
  approveBusiness: (businessId: string, notes?: string) => void;
  rejectBusiness: (businessId: string, reason: string) => void;
  suspendBusiness: (businessId: string, reason: string) => void;
  reactivateBusiness: (businessId: string) => void;
  toggleLocationStatus: (locationId: string) => void;

  // Actions - Business
  setActiveBusinessId: (id: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (productId: string, partial: Partial<Product>) => void;
  adjustInventory: (productId: string, quantityDelta: number, reason: string) => void;
  respondToQuotation: (
    quotationId: string,
    data: {
      quotedUnitPrice?: number;
      deliveryCharges: number;
      taxCharges: number;
      validityDays: number;
      termsAndNotes?: string;
    }
  ) => void;
  acceptOrder: (orderId: string) => void;
  prepareOrder: (orderId: string) => void;
  markOrderReadyForDispatch: (orderId: string) => void;

  // Actions - Customer
  setActiveCustomerId: (id: string) => void;
  addToCart: (product: Product, quantity: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  submitQuotationRequest: (data: {
    businessId: string;
    items: { productId: string; requestedQty: number; notes?: string }[];
    notes?: string;
  }) => Quotation;
  acceptQuotation: (quotationId: string) => Order;

  // Actions - Delivery
  setActiveDeliveryPartnerId: (id: string) => void;
  toggleDeliveryPartnerOnline: (partnerId: string) => void;
  acceptDeliveryJob: (assignmentId: string, partnerId: string) => boolean;
  confirmDeliveryPickup: (assignmentId: string) => void;
  markDeliveryInTransit: (assignmentId: string) => void;
  completeDelivery: (assignmentId: string, enteredOtp: string) => { success: boolean; message: string };
  reportDeliveryException: (assignmentId: string, reason: string) => void;

  // Actions - Demo Controller
  setDemoStep: (stepNumber: number) => void;
  toggleGuidedTour: () => void;
  advanceDemoStep: () => void;
  resetDemoData: () => void;
  addAuditLog: (action: string, targetType: string, targetId: string, details: string) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
}

const initialCart: Cart = {
  items: [],
  subtotal: 0,
  estimatedDeliveryFee: 0,
  estimatedTax: 0,
  totalEstimatedAmount: 0,
};

function calculateCartTotals(items: CartItem[]): Cart {
  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
  const estimatedDeliveryFee = items.length > 0 ? (subtotal > 20000 ? 500 : 800) : 0;
  const estimatedTax = Math.round(subtotal * 0.18); // standard 18% GST estimate
  const totalEstimatedAmount = subtotal + estimatedDeliveryFee + estimatedTax;

  return {
    items,
    businessId: items.length > 0 ? items[0].businessId : undefined,
    businessName: items.length > 0 ? items[0].businessName : undefined,
    subtotal,
    estimatedDeliveryFee,
    estimatedTax,
    totalEstimatedAmount,
  };
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      currentRole: 'SUPER_ADMIN',
      activeBusinessId: 'biz-lakshmi',
      activeCustomerId: 'cust-ramesh',
      activeDeliveryPartnerId: 'driver-murugan',
      currentDemoStep: 1,
      guidedTourOpen: false,

      businesses: SEED_BUSINESSES,
      products: SEED_PRODUCTS,
      categories: SEED_CATEGORIES,
      inventoryMovements: [],
      customers: SEED_CUSTOMERS,
      deliveryPartners: SEED_DELIVERY_PARTNERS,
      quotations: SEED_QUOTATIONS,
      orders: SEED_ORDERS,
      deliveryAssignments: SEED_DELIVERY_ASSIGNMENTS,
      locations: SEED_LOCATIONS,
      auditLogs: SEED_AUDIT_LOGS,
      notifications: SEED_NOTIFICATIONS,
      cart: initialCart,

      setCurrentRole: (role) => set({ currentRole: role }),
      setActiveBusinessId: (id) => set({ activeBusinessId: id }),
      setActiveCustomerId: (id) => set({ activeCustomerId: id }),
      setActiveDeliveryPartnerId: (id) => set({ activeDeliveryPartnerId: id }),

      setDemoStep: (stepNumber) => {
        const step = DEMO_WORKFLOW_STEPS.find((s) => s.stepNumber === stepNumber);
        if (step) {
          let roleToSet: UserRole = 'SUPER_ADMIN';
          if (step.actor === 'ADMIN') roleToSet = 'SUPER_ADMIN';
          else if (step.actor === 'BUSINESS') roleToSet = 'BUSINESS_OWNER';
          else if (step.actor === 'CUSTOMER') roleToSet = 'CUSTOMER';
          else if (step.actor === 'DELIVERY') roleToSet = 'DELIVERY_PARTNER';

          set({ currentDemoStep: stepNumber, currentRole: roleToSet });
        }
      },

      toggleGuidedTour: () => set((state) => ({ guidedTourOpen: !state.guidedTourOpen })),

      advanceDemoStep: () => {
        const next = Math.min(get().currentDemoStep + 1, DEMO_WORKFLOW_STEPS.length);
        get().setDemoStep(next);
      },

      addAuditLog: (action, targetType, targetId, details) => {
        const newLog: AuditLog = {
          id: `aud-${Date.now()}`,
          actorId: 'demo-user',
          actorName: get().currentRole,
          actorRole: get().currentRole,
          action,
          targetType,
          targetId,
          details,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));
      },

      addNotification: (notif) => {
        const newNotif: NotificationItem = {
          ...notif,
          id: `notif-${Date.now()}`,
          read: false,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ notifications: [newNotif, ...state.notifications] }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }));
      },

      // Admin actions
      approveBusiness: (businessId, notes) => {
        const target = get().businesses.find((b) => b.id === businessId);
        if (!target) return;

        set((state) => ({
          businesses: state.businesses.map((b) =>
            b.id === businessId
              ? {
                  ...b,
                  verificationStatus: 'APPROVED',
                  verificationNotes: notes || 'Verified documents, GSTIN & trade compliance by Administrator.',
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        }));

        get().addAuditLog('BUSINESS_APPROVAL', 'BUSINESS', businessId, `Approved ${target.name} for active trading.`);
        get().addNotification({
          recipientRole: 'BUSINESS',
          title: 'Store Approved!',
          message: `Congratulations! ${target.name} is now approved to receive customer orders on PavePort.`,
          actionUrl: '/business/products',
        });
      },

      rejectBusiness: (businessId, reason) => {
        const target = get().businesses.find((b) => b.id === businessId);
        if (!target) return;

        set((state) => ({
          businesses: state.businesses.map((b) =>
            b.id === businessId
              ? {
                  ...b,
                  verificationStatus: 'REJECTED',
                  verificationNotes: reason,
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        }));
        get().addAuditLog('BUSINESS_REJECTION', 'BUSINESS', businessId, `Rejected ${target.name}: ${reason}`);
      },

      suspendBusiness: (businessId, reason) => {
        const target = get().businesses.find((b) => b.id === businessId);
        if (!target) return;

        set((state) => ({
          businesses: state.businesses.map((b) =>
            b.id === businessId
              ? {
                  ...b,
                  verificationStatus: 'SUSPENDED',
                  verificationNotes: reason,
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        }));
        get().addAuditLog('BUSINESS_SUSPENSION', 'BUSINESS', businessId, `Suspended ${target.name}: ${reason}`);
      },

      reactivateBusiness: (businessId) => {
        const target = get().businesses.find((b) => b.id === businessId);
        if (!target) return;

        set((state) => ({
          businesses: state.businesses.map((b) =>
            b.id === businessId
              ? {
                  ...b,
                  verificationStatus: 'APPROVED',
                  verificationNotes: 'Reactivated by Super Administrator.',
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        }));
        get().addAuditLog('BUSINESS_REACTIVATION', 'BUSINESS', businessId, `Reactivated ${target.name}`);
      },

      toggleLocationStatus: (locationId) => {
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === locationId
              ? { ...loc, status: loc.status === 'ACTIVE' ? 'LAUNCHING_SOON' : 'ACTIVE' }
              : loc
          ),
        }));
      },

      // Business actions
      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: `prod-${Date.now()}`,
          isArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({ products: [newProduct, ...state.products] }));
        get().addAuditLog('PRODUCT_CREATE', 'PRODUCT', newProduct.id, `Created product ${newProduct.name}`);
        return newProduct;
      },

      updateProduct: (productId, partial) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, ...partial, updatedAt: new Date().toISOString() } : p
          ),
        }));
        get().addAuditLog('PRODUCT_UPDATE', 'PRODUCT', productId, `Updated product attributes for ${productId}`);
      },

      adjustInventory: (productId, quantityDelta, reason) => {
        const product = get().products.find((p) => p.id === productId);
        if (!product) return;

        const previousStock = product.availableStock;
        const newStock = Math.max(0, previousStock + quantityDelta);

        const movement: InventoryMovement = {
          id: `mov-${Date.now()}`,
          productId,
          productName: product.name,
          businessId: product.businessId,
          type: quantityDelta > 0 ? 'INFLOW' : 'ADJUSTMENT',
          quantity: Math.abs(quantityDelta),
          previousStock,
          newStock,
          reason,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          products: state.products.map((p) => (p.id === productId ? { ...p, availableStock: newStock } : p)),
          inventoryMovements: [movement, ...state.inventoryMovements],
        }));

        get().addAuditLog(
          'INVENTORY_ADJUST',
          'PRODUCT',
          productId,
          `Adjusted ${product.name} stock by ${quantityDelta} units. Reason: ${reason}`
        );
      },

      respondToQuotation: (quotationId, data) => {
        const quotation = get().quotations.find((q) => q.id === quotationId);
        if (!quotation) return;

        const updatedItems = quotation.items.map((item) => {
          const unitPrice = data.quotedUnitPrice ?? item.quotedUnitPrice;
          return {
            ...item,
            quotedUnitPrice: unitPrice,
            subtotal: unitPrice * item.requestedQty,
          };
        });

        const subtotal = updatedItems.reduce((acc, item) => acc + item.subtotal, 0);
        const validUntil = new Date(Date.now() + (data.validityDays || 7) * 86400000).toISOString();
        const totalEstimatedAmount = subtotal + data.deliveryCharges + data.taxCharges;

        set((state) => ({
          quotations: state.quotations.map((q) =>
            q.id === quotationId
              ? {
                  ...q,
                  items: updatedItems,
                  subtotal,
                  deliveryCharges: data.deliveryCharges,
                  taxCharges: data.taxCharges,
                  totalEstimatedAmount,
                  validityDays: data.validityDays,
                  validUntil,
                  status: 'REVIEWED_AND_QUOTED',
                  termsAndNotes: data.termsAndNotes || q.termsAndNotes,
                  respondedAt: new Date().toISOString(),
                }
              : q
          ),
        }));

        get().addAuditLog('QUOTATION_RESPOND', 'QUOTATION', quotationId, `Supplier submitted quote response for ${quotation.quotationNumber}`);
        get().addNotification({
          recipientRole: 'CUSTOMER',
          title: 'Quotation Ready for Review',
          message: `${quotation.businessName} has responded to your quote #${quotation.quotationNumber} with official pricing.`,
          actionUrl: '/customer/quotations',
        });
      },

      acceptOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status: 'ACCEPTED', updatedAt: new Date().toISOString() } : o
          ),
        }));
        get().addAuditLog('ORDER_ACCEPT', 'ORDER', orderId, `Business accepted order ${orderId}`);
      },

      prepareOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status: 'PREPARING', updatedAt: new Date().toISOString() } : o
          ),
        }));
        get().addAuditLog('ORDER_PREPARE', 'ORDER', orderId, `Warehouse is packing materials for ${orderId}`);
      },

      markOrderReadyForDispatch: (orderId) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (!order) return;

        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status: 'READY_FOR_DISPATCH', updatedAt: new Date().toISOString() } : o
          ),
        }));

        // Broadcast a DeliveryAssignment if none exists
        const existingAsn = get().deliveryAssignments.find((a) => a.orderId === orderId);
        if (!existingAsn) {
          const business = get().businesses.find((b) => b.id === order.businessId);
          const newAssignment: DeliveryAssignment = {
            id: `asn-${Date.now()}`,
            orderId: order.id,
            orderNumber: order.orderNumber,
            businessId: order.businessId,
            businessName: order.businessName,
            pickupAddress: business ? business.address : order.deliveryAddress,
            dropoffAddress: order.deliveryAddress,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            itemsSummary: order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', '),
            totalWeightTons: 2.0,
            specialHandlingNotes: 'Check delivery site clearance. Verify customer OTP upon unloading.',
            status: 'AVAILABLE',
            compensationAmount: Math.max(750, Math.round(order.deliveryFee * 0.85)),
            estimatedDistanceKm: 12.8,
          };

          set((state) => ({
            deliveryAssignments: [newAssignment, ...state.deliveryAssignments],
          }));

          get().addNotification({
            recipientRole: 'DELIVERY',
            title: 'New Haulage Job Available',
            message: `Pickup available at ${order.businessName} for delivery to ${order.deliveryAddress.locality}. Compensation: ₹${newAssignment.compensationAmount}`,
            actionUrl: '/delivery/available-jobs',
          });
        }

        get().addAuditLog('ORDER_READY_DISPATCH', 'ORDER', orderId, `Order ${order.orderNumber} marked ready for pickup.`);
      },

      // Customer actions
      addToCart: (product, quantity) => {
        const { cart } = get();
        // Check single business constraint or reset if different business
        let currentItems = [...cart.items];
        if (cart.businessId && cart.businessId !== product.businessId && currentItems.length > 0) {
          // Switch to new business cart
          currentItems = [];
        }

        const existingIndex = currentItems.findIndex((i) => i.productId === product.id);
        if (existingIndex >= 0) {
          const item = currentItems[existingIndex];
          const newQty = item.quantity + quantity;
          currentItems[existingIndex] = {
            ...item,
            quantity: newQty,
            subtotal: newQty * item.pricePerUnit,
          };
        } else {
          currentItems.push({
            productId: product.id,
            productName: product.name,
            businessId: product.businessId,
            businessName: product.businessName,
            brand: product.brand,
            unit: product.unit,
            pricePerUnit: product.pricePerUnit,
            quantity,
            subtotal: quantity * product.pricePerUnit,
            imageUrl: product.imageUrl,
          });
        }

        set({ cart: calculateCartTotals(currentItems) });
      },

      updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        const updated = get().cart.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity, subtotal: quantity * item.pricePerUnit }
            : item
        );
        set({ cart: calculateCartTotals(updated) });
      },

      removeFromCart: (productId) => {
        const updated = get().cart.items.filter((item) => item.productId !== productId);
        set({ cart: calculateCartTotals(updated) });
      },

      clearCart: () => set({ cart: initialCart }),

      submitQuotationRequest: ({ businessId, items, notes }) => {
        const business = get().businesses.find((b) => b.id === businessId);
        const customer = get().customers.find((c) => c.id === get().activeCustomerId) || get().customers[0];

        const quotationItems = items.map((i) => {
          const prod = get().products.find((p) => p.id === i.productId);
          const price = prod ? prod.pricePerUnit : 100;
          return {
            productId: i.productId,
            productName: prod ? prod.name : 'Construction Material',
            brand: prod ? prod.brand : 'Standard',
            unit: prod ? prod.unit : 'Unit',
            requestedQty: i.requestedQty,
            quotedUnitPrice: price,
            subtotal: price * i.requestedQty,
            notes: i.notes,
          };
        });

        const subtotal = quotationItems.reduce((acc, it) => acc + it.subtotal, 0);
        const deliveryCharges = subtotal > 20000 ? 1000 : 800;
        const taxCharges = Math.round(subtotal * 0.18);
        const totalEstimatedAmount = subtotal + deliveryCharges + taxCharges;

        const newQuote: Quotation = {
          id: `quote-${Date.now()}`,
          quotationNumber: `PV-QT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          customerId: customer.id,
          customerName: customer.name,
          customerPhone: customer.phone,
          customerAddress: customer.defaultAddress,
          businessId,
          businessName: business ? business.name : 'Construction Supplier',
          items: quotationItems,
          subtotal,
          deliveryCharges,
          taxCharges,
          totalEstimatedAmount,
          validityDays: 7,
          validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
          status: 'SUBMITTED',
          termsAndNotes: notes || 'Direct unloading requested at ground floor construction site.',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          quotations: [newQuote, ...state.quotations],
        }));

        get().addAuditLog('QUOTATION_SUBMIT', 'QUOTATION', newQuote.id, `Customer ${customer.name} requested quote ${newQuote.quotationNumber}`);
        get().addNotification({
          recipientRole: 'BUSINESS',
          title: 'New Commercial Quotation Request',
          message: `${customer.name} requested bulk estimate for ${quotationItems.length} material lines.`,
          actionUrl: '/business/quotations',
        });

        return newQuote;
      },

      acceptQuotation: (quotationId) => {
        const quotation = get().quotations.find((q) => q.id === quotationId);
        if (!quotation) throw new Error('Quotation not found');

        const newOrder: Order = {
          id: `ord-${Date.now()}`,
          orderNumber: `PV-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          quotationId: quotation.id,
          customerId: quotation.customerId,
          customerName: quotation.customerName,
          customerPhone: quotation.customerPhone,
          deliveryAddress: quotation.customerAddress,
          businessId: quotation.businessId,
          businessName: quotation.businessName,
          items: quotation.items.map((it) => ({
            productId: it.productId,
            productName: it.productName,
            brand: it.brand,
            unit: it.unit,
            quantity: it.requestedQty,
            unitPrice: it.quotedUnitPrice,
            total: it.subtotal,
          })),
          subtotal: quotation.subtotal,
          deliveryFee: quotation.deliveryCharges,
          taxAmount: quotation.taxCharges,
          totalAmount: quotation.totalEstimatedAmount,
          paymentStatus: 'SIMULATED_PAID',
          paymentMethod: 'Commercial Purchase Order / UPI (Demo)',
          status: 'PLACED',
          deliveryOtp: '4829', // Deterministic demo OTP for step 8
          expectedDeliveryDate: new Date(Date.now() + 86400000).toISOString(),
          notes: quotation.termsAndNotes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Update quotation status
        set((state) => ({
          quotations: state.quotations.map((q) =>
            q.id === quotationId ? { ...q, status: 'CONVERTED_TO_ORDER', orderId: newOrder.id } : q
          ),
          orders: [newOrder, ...state.orders],
        }));

        // Reserve stock for products
        quotation.items.forEach((item) => {
          const product = get().products.find((p) => p.id === item.productId);
          if (product) {
            const available = Math.max(0, product.availableStock - item.requestedQty);
            const reserved = product.reservedStock + item.requestedQty;
            get().updateProduct(product.id, { availableStock: available, reservedStock: reserved });
          }
        });

        get().addAuditLog('ORDER_CREATE_FROM_QUOTE', 'ORDER', newOrder.id, `Order ${newOrder.orderNumber} placed from accepted quotation ${quotation.quotationNumber}`);
        get().addNotification({
          recipientRole: 'BUSINESS',
          title: 'Quotation Accepted! Order Created',
          message: `${quotation.customerName} accepted quote #${quotation.quotationNumber}. Order ${newOrder.orderNumber} is awaiting acceptance.`,
          actionUrl: '/business/orders',
        });

        return newOrder;
      },

      // Delivery actions
      toggleDeliveryPartnerOnline: (partnerId) => {
        set((state) => ({
          deliveryPartners: state.deliveryPartners.map((dp) =>
            dp.id === partnerId ? { ...dp, isOnline: !dp.isOnline } : dp
          ),
        }));
      },

      acceptDeliveryJob: (assignmentId, partnerId) => {
        const assignment = get().deliveryAssignments.find((a) => a.id === assignmentId);
        if (!assignment || assignment.status !== 'AVAILABLE') return false;

        const partner = get().deliveryPartners.find((p) => p.id === partnerId);
        if (!partner) return false;

        set((state) => ({
          deliveryAssignments: state.deliveryAssignments.map((a) =>
            a.id === assignmentId
              ? {
                  ...a,
                  status: 'ACCEPTED',
                  partnerId: partner.id,
                  partnerName: partner.name,
                  partnerPhone: partner.phone,
                  assignedAt: new Date().toISOString(),
                }
              : a
          ),
          orders: state.orders.map((o) =>
            o.id === assignment.orderId
              ? {
                  ...o,
                  status: 'ASSIGNED',
                  deliveryPartnerId: partner.id,
                  deliveryPartnerName: partner.name,
                  deliveryPartnerPhone: partner.phone,
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));

        get().addAuditLog('DELIVERY_ACCEPT', 'DELIVERY_ASSIGNMENT', assignmentId, `Partner ${partner.name} accepted haulage for ${assignment.orderNumber}`);
        get().addNotification({
          recipientRole: 'CUSTOMER',
          title: 'Delivery Partner Assigned',
          message: `${partner.name} (${partner.vehicleNumber}) has been assigned to transport your materials.`,
          actionUrl: `/customer/orders/${assignment.orderId}`,
        });

        return true;
      },

      confirmDeliveryPickup: (assignmentId) => {
        const assignment = get().deliveryAssignments.find((a) => a.id === assignmentId);
        if (!assignment) return;

        set((state) => ({
          deliveryAssignments: state.deliveryAssignments.map((a) =>
            a.id === assignmentId ? { ...a, status: 'PICKED_UP' } : a
          ),
          orders: state.orders.map((o) =>
            o.id === assignment.orderId ? { ...o, status: 'PICKED_UP', updatedAt: new Date().toISOString() } : o
          ),
        }));

        get().addAuditLog('DELIVERY_PICKUP', 'DELIVERY_ASSIGNMENT', assignmentId, `Driver picked up materials at ${assignment.businessName}`);
      },

      markDeliveryInTransit: (assignmentId) => {
        const assignment = get().deliveryAssignments.find((a) => a.id === assignmentId);
        if (!assignment) return;

        set((state) => ({
          deliveryAssignments: state.deliveryAssignments.map((a) =>
            a.id === assignmentId ? { ...a, status: 'IN_TRANSIT' } : a
          ),
          orders: state.orders.map((o) =>
            o.id === assignment.orderId ? { ...o, status: 'IN_TRANSIT', updatedAt: new Date().toISOString() } : o
          ),
        }));

        get().addAuditLog('DELIVERY_IN_TRANSIT', 'DELIVERY_ASSIGNMENT', assignmentId, `Trip in transit to ${assignment.dropoffAddress.locality}`);
      },

      completeDelivery: (assignmentId, enteredOtp) => {
        const assignment = get().deliveryAssignments.find((a) => a.id === assignmentId);
        if (!assignment) return { success: false, message: 'Assignment not found' };

        const order = get().orders.find((o) => o.id === assignment.orderId);
        if (!order) return { success: false, message: 'Order not found' };

        // Verify OTP (accept standard demo OTP 4829 or order's exact OTP)
        if (enteredOtp !== order.deliveryOtp && enteredOtp !== '4829') {
          return {
            success: false,
            message: `Invalid OTP code '${enteredOtp}'. Customer demo verification code is 4829.`,
          };
        }

        set((state) => ({
          deliveryAssignments: state.deliveryAssignments.map((a) =>
            a.id === assignmentId
              ? {
                  ...a,
                  status: 'COMPLETED',
                  completedAt: new Date().toISOString(),
                }
              : a
          ),
          orders: state.orders.map((o) =>
            o.id === assignment.orderId
              ? {
                  ...o,
                  status: 'DELIVERED',
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
          deliveryPartners: state.deliveryPartners.map((dp) =>
            dp.id === assignment.partnerId
              ? {
                  ...dp,
                  completedTrips: dp.completedTrips + 1,
                  todayTrips: dp.todayTrips + 1,
                  earningsToday: dp.earningsToday + assignment.compensationAmount,
                }
              : dp
          ),
        }));

        get().addAuditLog('DELIVERY_COMPLETE', 'DELIVERY_ASSIGNMENT', assignmentId, `Verified OTP ${enteredOtp} and delivered ${order.orderNumber} to ${order.customerName}`);
        get().addNotification({
          recipientRole: 'CUSTOMER',
          title: 'Materials Delivered Successfully!',
          message: `Your materials for ${order.orderNumber} have been safely delivered and signed off.`,
          actionUrl: `/customer/orders/${order.id}`,
        });
        get().addNotification({
          recipientRole: 'BUSINESS',
          title: 'Delivery Completed',
          message: `Order ${order.orderNumber} successfully hauled and delivered by ${assignment.partnerName}.`,
          actionUrl: `/business/orders`,
        });

        return { success: true, message: 'Delivery completed successfully with verified proof-of-delivery!' };
      },

      reportDeliveryException: (assignmentId, reason) => {
        set((state) => ({
          deliveryAssignments: state.deliveryAssignments.map((a) =>
            a.id === assignmentId ? { ...a, exceptionReason: reason } : a
          ),
        }));
        get().addAuditLog('DELIVERY_EXCEPTION', 'DELIVERY_ASSIGNMENT', assignmentId, `Reported exception: ${reason}`);
      },

      resetDemoData: () => {
        set({
          businesses: SEED_BUSINESSES,
          products: SEED_PRODUCTS,
          categories: SEED_CATEGORIES,
          inventoryMovements: [],
          customers: SEED_CUSTOMERS,
          deliveryPartners: SEED_DELIVERY_PARTNERS,
          quotations: SEED_QUOTATIONS,
          orders: SEED_ORDERS,
          deliveryAssignments: SEED_DELIVERY_ASSIGNMENTS,
          locations: SEED_LOCATIONS,
          auditLogs: SEED_AUDIT_LOGS,
          notifications: SEED_NOTIFICATIONS,
          cart: initialCart,
          currentDemoStep: 1,
          currentRole: 'SUPER_ADMIN',
          activeBusinessId: 'biz-lakshmi',
          activeCustomerId: 'cust-ramesh',
          activeDeliveryPartnerId: 'driver-murugan',
        });
      },
    }),
    {
      name: 'paveport_demo_store_v1',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      partialize: (state) => ({
        currentRole: state.currentRole,
        activeBusinessId: state.activeBusinessId,
        activeCustomerId: state.activeCustomerId,
        activeDeliveryPartnerId: state.activeDeliveryPartnerId,
        currentDemoStep: state.currentDemoStep,
        businesses: state.businesses,
        products: state.products,
        quotations: state.quotations,
        orders: state.orders,
        deliveryAssignments: state.deliveryAssignments,
        locations: state.locations,
        auditLogs: state.auditLogs,
        notifications: state.notifications,
        cart: state.cart,
      }),
    }
  )
);
