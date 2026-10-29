import { PermissionKey, RoleDefinition, UserRole } from '@/types';

export const ALL_PERMISSIONS: { key: PermissionKey; name: string; category: string; description: string }[] = [
  { key: 'dashboard.read', name: 'View Dashboard', category: 'Analytics', description: 'Access executive and operational overview metrics' },
  { key: 'businesses.read', name: 'View Businesses', category: 'Suppliers', description: 'Search and inspect registered vendor profiles' },
  { key: 'businesses.approve', name: 'Approve Businesses', category: 'Suppliers', description: 'Verify submitted legal docs and activate suppliers' },
  { key: 'businesses.suspend', name: 'Suspend Businesses', category: 'Suppliers', description: 'Revoke vendor marketplace access and freeze catalog' },
  { key: 'customers.read', name: 'View Customers', category: 'Customers', description: 'Inspect contractor and homebuilder accounts' },
  { key: 'customers.manage', name: 'Manage Customers', category: 'Customers', description: 'Update status, resolve account disputes' },
  { key: 'products.read', name: 'View Products', category: 'Catalog', description: 'Browse platform-wide construction catalog' },
  { key: 'products.moderate', name: 'Moderate Products', category: 'Catalog', description: 'Flag, approve or archive unverified products' },
  { key: 'inventory.read', name: 'View Inventory', category: 'Catalog', description: 'Inspect stock levels, reservations, and alerts' },
  { key: 'orders.read', name: 'View Orders', category: 'Fulfillment', description: 'Monitor live commerce and quotation orders' },
  { key: 'orders.manage', name: 'Manage Orders', category: 'Fulfillment', description: 'Intervene, reassign or cancel problematic orders' },
  { key: 'quotations.read', name: 'View Quotations', category: 'Commerce', description: 'Inspect commercial bulk estimates and quotes' },
  { key: 'quotations.manage', name: 'Manage Quotations', category: 'Commerce', description: 'Resolve quotation discrepancies and pricing issues' },
  { key: 'deliveries.read', name: 'View Deliveries', category: 'Logistics', description: 'Track fleet movement and fulfillment dispatches' },
  { key: 'deliveries.assign', name: 'Assign Deliveries', category: 'Logistics', description: 'Dispatch orders to verified delivery partners' },
  { key: 'locations.manage', name: 'Manage Locations', category: 'Operations', description: 'Configure pincodes, serviceable zones, and cities' },
  { key: 'users.manage', name: 'Manage Staff Users', category: 'Security', description: 'Invite internal operators and assign admin roles' },
  { key: 'roles.read', name: 'View Roles', category: 'Security', description: 'Inspect RBAC role permissions matrix' },
  { key: 'roles.manage', name: 'Manage Roles', category: 'Security', description: 'Customize permission assignments per role' },
  { key: 'reports.read', name: 'View Reports', category: 'Finance', description: 'Access revenue, gross margin, and volume analytics' },
  { key: 'reports.export', name: 'Export Reports', category: 'Finance', description: 'Download CSV / XLSX financial audits' },
  { key: 'audit_logs.read', name: 'View Audit Logs', category: 'Security', description: 'Inspect immutable records of administrative actions' },
  { key: 'settings.manage', name: 'Manage Settings', category: 'System', description: 'Adjust platform fees, tax brackets, and SLAs' },
];

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  SUPER_ADMIN: {
    id: 'SUPER_ADMIN',
    name: 'Super Administrator',
    description: 'Full unconstrained platform control, security management, and audit inspection.',
    permissions: ALL_PERMISSIONS.map(p => p.key),
  },
  OPERATIONS_ADMIN: {
    id: 'OPERATIONS_ADMIN',
    name: 'Operations Administrator',
    description: 'Oversees day-to-day fulfillment, business verification, and delivery coordination.',
    permissions: [
      'dashboard.read',
      'businesses.read',
      'businesses.approve',
      'customers.read',
      'products.read',
      'inventory.read',
      'orders.read',
      'orders.manage',
      'quotations.read',
      'deliveries.read',
      'deliveries.assign',
      'locations.manage',
      'audit_logs.read',
    ],
  },
  BUSINESS_VERIFICATION_ADMIN: {
    id: 'BUSINESS_VERIFICATION_ADMIN',
    name: 'Business Verification Admin',
    description: 'Specialized in checking supplier GSTIN, trade licenses, and approving vendor stores.',
    permissions: [
      'dashboard.read',
      'businesses.read',
      'businesses.approve',
      'businesses.suspend',
      'products.read',
      'audit_logs.read',
    ],
  },
  CATALOG_MANAGER: {
    id: 'CATALOG_MANAGER',
    name: 'Catalog & Inventory Manager',
    description: 'Standardizes material grades (e.g. Fe550D, OPC 53), units of measure, and moderates items.',
    permissions: [
      'dashboard.read',
      'products.read',
      'products.moderate',
      'inventory.read',
      'locations.manage',
    ],
  },
  LOGISTICS_MANAGER: {
    id: 'LOGISTICS_MANAGER',
    name: 'Logistics & Fleet Manager',
    description: 'Coordinates heavy tippers, flatbed trucks, and driver job dispatching.',
    permissions: [
      'dashboard.read',
      'orders.read',
      'deliveries.read',
      'deliveries.assign',
      'locations.manage',
    ],
  },
  CUSTOMER_SUPPORT_AGENT: {
    id: 'CUSTOMER_SUPPORT_AGENT',
    name: 'Customer Support Specialist',
    description: 'Reads orders, answers contractor inquiries, and handles delivery escalations.',
    permissions: [
      'dashboard.read',
      'customers.read',
      'orders.read',
      'quotations.read',
      'deliveries.read',
    ],
  },
  FINANCE_VIEWER: {
    id: 'FINANCE_VIEWER',
    name: 'Finance & Compliance Auditor',
    description: 'Read-only financial reporting, GST settlements, and revenue reconciliation.',
    permissions: [
      'dashboard.read',
      'orders.read',
      'quotations.read',
      'reports.read',
      'reports.export',
      'audit_logs.read',
    ],
  },
  BUSINESS_OWNER: {
    id: 'BUSINESS_OWNER',
    name: 'Supplier / Business Owner',
    description: 'Manages private store catalog, inventory stock, incoming quotes, and orders.',
    permissions: ['products.read', 'inventory.read', 'orders.read', 'quotations.read'],
  },
  CUSTOMER: {
    id: 'CUSTOMER',
    name: 'Customer / Contractor',
    description: 'Discovers verified stores, requests bulk material estimates, and tracks deliveries.',
    permissions: ['products.read'],
  },
  DELIVERY_PARTNER: {
    id: 'DELIVERY_PARTNER',
    name: 'Delivery Driver / Partner',
    description: 'Accepts hauling assignments, logs dispatch milestones, and verifies OTP at job sites.',
    permissions: ['deliveries.read'],
  },
};

export function hasPermission(role: UserRole, permission: PermissionKey): boolean {
  const def = ROLE_DEFINITIONS[role];
  if (!def) return false;
  return def.permissions.includes(permission);
}

