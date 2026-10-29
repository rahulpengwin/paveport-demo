import { useDemoStore } from '@/stores/useDemoStore';
import {
  Business,
  Product,
  Quotation,
  Order,
  DeliveryAssignment,
  AuditLog,
} from '@/types';

// Simulated latency to demonstrate loading states accurately
const simulateDelay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const paveportApi = {
  admin: {
    getOverviewStats: async () => {
      await simulateDelay();
      const state = useDemoStore.getState();
      const totalBusinesses = state.businesses.length;
      const pendingApprovals = state.businesses.filter((b) => b.verificationStatus === 'PENDING').length;
      const totalOrders = state.orders.length;
      const totalGmv = state.orders.reduce((sum, o) => sum + o.totalAmount, 0);
      const inTransitOrders = state.orders.filter((o) => o.status === 'IN_TRANSIT').length;
      const activeDrivers = state.deliveryPartners.filter((d) => d.isOnline).length;
      const pendingQuotes = state.quotations.filter((q) => q.status === 'SUBMITTED').length;

      return {
        data: {
          totalBusinesses,
          pendingApprovals,
          totalCustomers: state.customers.length,
          activeDeliveryPartners: activeDrivers,
          totalOrdersToday: totalOrders,
          grossMerchandiseValue: totalGmv,
          pendingQuotationsCount: pendingQuotes,
          ordersInTransitCount: inTransitOrders,
          failedOrDelayedCount: 0,
          inventoryAlertsCount: state.products.filter((p) => p.availableStock <= p.lowStockThreshold).length,
        },
      };
    },

    getAuditLogs: async (): Promise<{ data: AuditLog[] }> => {
      await simulateDelay();
      return { data: useDemoStore.getState().auditLogs };
    },
  },

  businesses: {
    list: async (): Promise<{ data: Business[] }> => {
      await simulateDelay();
      return { data: useDemoStore.getState().businesses };
    },

    getById: async (id: string): Promise<{ data: Business | undefined }> => {
      await simulateDelay();
      return { data: useDemoStore.getState().businesses.find((b) => b.id === id) };
    },

    approve: async (id: string, notes?: string): Promise<{ success: boolean }> => {
      await simulateDelay(300);
      useDemoStore.getState().approveBusiness(id, notes);
      return { success: true };
    },

    suspend: async (id: string, reason: string): Promise<{ success: boolean }> => {
      await simulateDelay(300);
      useDemoStore.getState().suspendBusiness(id, reason);
      return { success: true };
    },
  },

  products: {
    list: async (businessId?: string): Promise<{ data: Product[] }> => {
      await simulateDelay();
      const state = useDemoStore.getState();
      const prods = businessId ? state.products.filter((p) => p.businessId === businessId) : state.products;
      return { data: prods };
    },

    create: async (payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: Product }> => {
      await simulateDelay(300);
      const created = useDemoStore.getState().addProduct(payload);
      return { data: created };
    },

    adjustStock: async (productId: string, quantityDelta: number, reason: string): Promise<{ success: boolean }> => {
      await simulateDelay(250);
      useDemoStore.getState().adjustInventory(productId, quantityDelta, reason);
      return { success: true };
    },
  },

  quotations: {
    list: async (filter?: { businessId?: string; customerId?: string }): Promise<{ data: Quotation[] }> => {
      await simulateDelay();
      const state = useDemoStore.getState();
      let quotes = state.quotations;
      if (filter?.businessId) quotes = quotes.filter((q) => q.businessId === filter.businessId);
      if (filter?.customerId) quotes = quotes.filter((q) => q.customerId === filter.customerId);
      return { data: quotes };
    },

    submit: async (data: {
      businessId: string;
      items: { productId: string; requestedQty: number; notes?: string }[];
      notes?: string;
    }): Promise<{ data: Quotation }> => {
      await simulateDelay(400);
      const created = useDemoStore.getState().submitQuotationRequest(data);
      return { data: created };
    },

    respond: async (
      id: string,
      data: {
        quotedUnitPrice?: number;
        deliveryCharges: number;
        taxCharges: number;
        validityDays: number;
        termsAndNotes?: string;
      }
    ): Promise<{ success: boolean }> => {
      await simulateDelay(300);
      useDemoStore.getState().respondToQuotation(id, data);
      return { success: true };
    },

    accept: async (id: string): Promise<{ data: Order }> => {
      await simulateDelay(400);
      const order = useDemoStore.getState().acceptQuotation(id);
      return { data: order };
    },
  },

  orders: {
    list: async (filter?: { businessId?: string; customerId?: string }): Promise<{ data: Order[] }> => {
      await simulateDelay();
      const state = useDemoStore.getState();
      let orders = state.orders;
      if (filter?.businessId) orders = orders.filter((o) => o.businessId === filter.businessId);
      if (filter?.customerId) orders = orders.filter((o) => o.customerId === filter.customerId);
      return { data: orders };
    },

    accept: async (orderId: string): Promise<{ success: boolean }> => {
      await simulateDelay(250);
      useDemoStore.getState().acceptOrder(orderId);
      return { success: true };
    },

    prepare: async (orderId: string): Promise<{ success: boolean }> => {
      await simulateDelay(250);
      useDemoStore.getState().prepareOrder(orderId);
      return { success: true };
    },

    readyForDispatch: async (orderId: string): Promise<{ success: boolean }> => {
      await simulateDelay(300);
      useDemoStore.getState().markOrderReadyForDispatch(orderId);
      return { success: true };
    },
  },

  deliveries: {
    list: async (filter?: { partnerId?: string; status?: string }): Promise<{ data: DeliveryAssignment[] }> => {
      await simulateDelay();
      const state = useDemoStore.getState();
      let asns = state.deliveryAssignments;
      if (filter?.partnerId) asns = asns.filter((a) => a.partnerId === filter.partnerId);
      if (filter?.status) asns = asns.filter((a) => a.status === filter.status);
      return { data: asns };
    },

    accept: async (assignmentId: string, partnerId: string): Promise<{ success: boolean }> => {
      await simulateDelay(300);
      const ok = useDemoStore.getState().acceptDeliveryJob(assignmentId, partnerId);
      return { success: ok };
    },

    pickup: async (assignmentId: string): Promise<{ success: boolean }> => {
      await simulateDelay(250);
      useDemoStore.getState().confirmDeliveryPickup(assignmentId);
      return { success: true };
    },

    inTransit: async (assignmentId: string): Promise<{ success: boolean }> => {
      await simulateDelay(250);
      useDemoStore.getState().markDeliveryInTransit(assignmentId);
      return { success: true };
    },

    complete: async (assignmentId: string, otp: string): Promise<{ success: boolean; message: string }> => {
      await simulateDelay(400);
      return useDemoStore.getState().completeDelivery(assignmentId, otp);
    },
  },
};

