export type UserRole =
  | 'SUPER_ADMIN'
  | 'OPERATIONS_ADMIN'
  | 'BUSINESS_VERIFICATION_ADMIN'
  | 'CATALOG_MANAGER'
  | 'LOGISTICS_MANAGER'
  | 'CUSTOMER_SUPPORT_AGENT'
  | 'FINANCE_VIEWER'
  | 'BUSINESS_OWNER'
  | 'CUSTOMER'
  | 'DELIVERY_PARTNER';

export type PermissionKey =
  | 'dashboard.read'
  | 'businesses.read'
  | 'businesses.approve'
  | 'businesses.suspend'
  | 'customers.read'
  | 'customers.manage'
  | 'products.read'
  | 'products.moderate'
  | 'inventory.read'
  | 'orders.read'
  | 'orders.manage'
  | 'quotations.read'
  | 'quotations.manage'
  | 'deliveries.read'
  | 'deliveries.assign'
  | 'locations.manage'
  | 'users.manage'
  | 'roles.read'
  | 'roles.manage'
  | 'reports.read'
  | 'reports.export'
  | 'audit_logs.read'
  | 'settings.manage';

export interface Address {
  street: string;
  locality: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type BusinessVerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface BusinessDocument {
  id: string;
  businessId: string;
  type: 'GSTIN' | 'TRADE_LICENSE' | 'PAN' | 'BANK_STATEMENT';
  documentName: string;
  documentNumber: string;
  fileUrl: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  registrationNumber: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  address: Address;
  categories: string[];
  serviceablePincodes: string[];
  operatingHours: string;
  verificationStatus: BusinessVerificationStatus;
  verificationNotes?: string;
  rating: number;
  reviewCount: number;
  minOrderValue: number;
  estimatedDeliveryHours: string;
  documents: BusinessDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  gstin?: string;
  defaultAddress: Address;
  addresses: Address[];
  savedStores: string[];
  totalOrders: number;
  totalSpent: number;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export type VehicleType = 'MINI_TRUCK' | 'FLATBED' | 'TIPPER' | 'CARGO_AUTO' | 'HEAVY_LORRY';

export interface DeliveryPartnerProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  capacityTonnes: number;
  licenseNumber: string;
  isOnline: boolean;
  activeDeliveryId?: string;
  rating: number;
  completedTrips: number;
  todayTrips: number;
  earningsToday: number;
  serviceZones: string[];
  status: 'VERIFIED' | 'PENDING' | 'OFFLINE';
  createdAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  uomOptions: string[];
  featured?: boolean;
}

export interface Product {
  id: string;
  businessId: string;
  businessName: string;
  name: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  gradeSpecification: string;
  unit: string;
  pricePerUnit: number;
  minOrderQty: number;
  availableStock: number;
  reservedStock: number;
  lowStockThreshold: number;
  imageUrl: string;
  handlingNotes: string;
  isArchived: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type InventoryMovementType = 'INFLOW' | 'RESERVED' | 'DISPATCHED' | 'ADJUSTMENT' | 'RELEASED';

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  businessId: string;
  type: InventoryMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceId?: string;
  reason: string;
  timestamp: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  businessId: string;
  businessName: string;
  brand: string;
  unit: string;
  pricePerUnit: number;
  quantity: number;
  subtotal: number;
  imageUrl: string;
}

export interface Cart {
  items: CartItem[];
  businessId?: string;
  businessName?: string;
  subtotal: number;
  estimatedDeliveryFee: number;
  estimatedTax: number;
  totalEstimatedAmount: number;
}

export type QuotationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'REVIEWED_AND_QUOTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CONVERTED_TO_ORDER';

export interface QuotationItem {
  productId: string;
  productName: string;
  brand: string;
  unit: string;
  requestedQty: number;
  quotedUnitPrice: number;
  subtotal: number;
  notes?: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: Address;
  businessId: string;
  businessName: string;
  items: QuotationItem[];
  subtotal: number;
  deliveryCharges: number;
  taxCharges: number;
  totalEstimatedAmount: number;
  validityDays: number;
  validUntil: string;
  status: QuotationStatus;
  termsAndNotes?: string;
  rejectionReason?: string;
  orderId?: string;
  createdAt: string;
  respondedAt?: string;
}

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY_FOR_DISPATCH'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'SIMULATED_PAID' | 'COD_PENDING' | 'PENDING';

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  quotationId?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: Address;
  businessId: string;
  businessName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  status: OrderStatus;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  deliveryOtp: string;
  expectedDeliveryDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type DeliveryAssignmentStatus = 'AVAILABLE' | 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';

export interface DeliveryAssignment {
  id: string;
  orderId: string;
  orderNumber: string;
  businessId: string;
  businessName: string;
  pickupAddress: Address;
  dropoffAddress: Address;
  customerName: string;
  customerPhone: string;
  itemsSummary: string;
  totalWeightTons: number;
  specialHandlingNotes?: string;
  status: DeliveryAssignmentStatus;
  partnerId?: string;
  partnerName?: string;
  partnerPhone?: string;
  compensationAmount: number;
  estimatedDistanceKm: number;
  assignedAt?: string;
  completedAt?: string;
  exceptionReason?: string;
}

export interface DeliveryEvent {
  id: string;
  assignmentId: string;
  orderId: string;
  status: string;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  recipientRole: 'ADMIN' | 'BUSINESS' | 'CUSTOMER' | 'DELIVERY';
  targetUserId?: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface ServiceLocation {
  id: string;
  state: string;
  district: string;
  city: string;
  pincode: string;
  activeBusinessesCount: number;
  activeDeliveryPartnersCount: number;
  status: 'ACTIVE' | 'LAUNCHING_SOON';
}

export interface RoleDefinition {
  id: UserRole;
  name: string;
  description: string;
  permissions: PermissionKey[];
}

