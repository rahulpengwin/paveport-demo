'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { Database, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function ArchitectureDatabasePage() {
  return (
    <AppShell
      appType="architecture"
      title="PostgreSQL Database Schema & ACID Concurrency"
      subtitle="Neon serverless Postgres data model with strict multi-tenant boundaries and row-level locking."
    >
      <div className="space-y-6 text-xs text-charcoal-300">
        {/* Financial Precision & Concurrency Guarantee */}
        <div className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Decimal-Safe Monetary Types & Concurrency Locks
          </h3>
          <p className="leading-relaxed">
            All financial columns (prices, delivery fees, GST tax calculations, driver payouts) are stored as{' '}
            <strong className="text-white font-mono">BIGINT</strong> representing Indian Rupee minor units (paise) or{' '}
            <strong className="text-white font-mono">NUMERIC(14,2)</strong>. Floating-point arithmetic is strictly
            forbidden in both database schemas and Go domain models.
          </p>

          <div className="p-3.5 rounded-lg bg-charcoal-950 border border-charcoal-800 text-[11px] space-y-2">
            <div className="flex items-center space-x-2 text-construction-400 font-mono font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>Overselling Prevention: SELECT FOR UPDATE</span>
            </div>
            <p className="text-charcoal-400 leading-relaxed">
              When converting an accepted quotation or cart into a purchase order, the transaction acquires an exclusive row
              lock on the matching <code className="text-white">inventory_items</code> row:
            </p>
            <pre className="text-emerald-400 font-mono">
{`BEGIN;
-- Lock stock row to prevent race conditions across parallel orders
SELECT available_stock, reserved_stock 
FROM inventory_items 
WHERE product_id = $1 AND business_id = $2 
FOR UPDATE;

-- Verify sufficiency and update
UPDATE inventory_items 
SET available_stock = available_stock - $3,
    reserved_stock = reserved_stock + $3,
    updated_at = NOW()
WHERE product_id = $1;

INSERT INTO orders (...);
COMMIT;`}
            </pre>
          </div>
        </div>

        {/* PostgreSQL Schema DDL */}
        <div className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Core Production DDL (Neon PostgreSQL 16)
          </h3>

          <div className="p-4 rounded-lg bg-charcoal-950 border border-charcoal-800 font-mono text-[11px] text-charcoal-300 overflow-x-auto leading-relaxed">
            <pre className="text-construction-300">
{`-- ENUM DEFINITIONS
CREATE TYPE business_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TYPE quotation_status AS ENUM ('SUBMITTED', 'REVIEWED_AND_QUOTED', 'ACCEPTED', 'REJECTED', 'CONVERTED_TO_ORDER');
CREATE TYPE order_status AS ENUM ('PLACED', 'ACCEPTED', 'PREPARING', 'READY_FOR_DISPATCH', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED');
CREATE TYPE delivery_status AS ENUM ('AVAILABLE', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED');

-- BUSINESSES (SUPPLIERS)
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(64) UNIQUE NOT NULL, -- GSTIN
    owner_name VARCHAR(128) NOT NULL,
    owner_phone VARCHAR(32) NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    status business_status NOT NULL DEFAULT 'PENDING',
    min_order_value_paise BIGINT NOT NULL DEFAULT 500000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PRODUCTS CATALOG
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category_id VARCHAR(64) NOT NULL,
    brand VARCHAR(128) NOT NULL,
    grade_specification VARCHAR(255) NOT NULL,
    unit VARCHAR(64) NOT NULL,
    price_per_unit_paise BIGINT NOT NULL,
    min_order_qty INT NOT NULL DEFAULT 1,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INVENTORY & RESERVATIONS
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    available_stock INT NOT NULL CHECK (available_stock >= 0),
    reserved_stock INT NOT NULL DEFAULT 0 CHECK (reserved_stock >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 20,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- COMMERCIAL QUOTATIONS
CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_number VARCHAR(64) UNIQUE NOT NULL,
    customer_id UUID NOT NULL,
    business_id UUID NOT NULL REFERENCES businesses(id),
    subtotal_paise BIGINT NOT NULL,
    delivery_fee_paise BIGINT NOT NULL,
    tax_paise BIGINT NOT NULL,
    total_amount_paise BIGINT NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    status quotation_status NOT NULL DEFAULT 'SUBMITTED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(64) UNIQUE NOT NULL,
    quotation_id UUID REFERENCES quotations(id),
    customer_id UUID NOT NULL,
    business_id UUID NOT NULL REFERENCES businesses(id),
    delivery_partner_id UUID,
    total_amount_paise BIGINT NOT NULL,
    delivery_otp VARCHAR(8) NOT NULL,
    status order_status NOT NULL DEFAULT 'PLACED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- DELIVERY ASSIGNMENTS (WITH SINGLE-ACCEPTANCE CONSTRAINT)
CREATE TABLE delivery_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    partner_id UUID,
    status delivery_status NOT NULL DEFAULT 'AVAILABLE',
    compensation_paise BIGINT NOT NULL,
    assigned_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- AUDIT TRAIL
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id VARCHAR(64) NOT NULL,
    actor_role VARCHAR(64) NOT NULL,
    action VARCHAR(128) NOT NULL,
    target_type VARCHAR(64) NOT NULL,
    target_id VARCHAR(64) NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXING STRATEGY
CREATE INDEX idx_products_business ON products(business_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_business ON orders(business_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_assignments_status ON delivery_assignments(status);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);`}
            </pre>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

