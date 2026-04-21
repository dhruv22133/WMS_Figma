import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Global error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ 
    error: err.message || 'Internal server error',
    details: err.toString()
  }, 500);
});

// Utility function to generate IDs
function generateId(): string {
  return crypto.randomUUID();
}

// Utility function to get current ISO timestamp
function getTimestamp(): string {
  return new Date().toISOString();
}

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

app.post("/make-server-36ac7b49/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || email.split('@')[0] },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message || 'Failed to create user' }, 400);
    }

    // Store user approval status in KV store
    const userApproval = {
      user_id: data.user.id,
      email: data.user.email,
      name: name || email.split('@')[0],
      status: 'pending', // pending, approved, rejected
      requested_at: getTimestamp(),
      approved_at: null,
      approved_by: null,
    };
    await kv.set(`user_approval:${data.user.id}`, userApproval);

    return c.json({ 
      success: true, 
      user: { 
        id: data.user.id, 
        email: data.user.email,
        status: 'pending'
      },
      message: 'Account created. Waiting for admin approval.'
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return c.json({ error: "Failed to create user account" }, 500);
  }
});

// Check user approval status
app.post("/make-server-36ac7b49/check-approval", async (c) => {
  try {
    const body = await c.req.json();
    const { user_id } = body;

    if (!user_id) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const approval = await kv.get(`user_approval:${user_id}`);
    
    if (!approval) {
      return c.json({ status: 'unknown', message: 'User not found' }, 404);
    }

    return c.json({ 
      status: approval.status,
      message: approval.status === 'pending' 
        ? 'Your account is pending approval by an administrator'
        : approval.status === 'approved'
        ? 'Your account has been approved'
        : 'Your account has been rejected'
    });
  } catch (error) {
    console.error("Error checking approval:", error);
    return c.json({ error: "Failed to check approval status" }, 500);
  }
});

// Get all user approvals (admin only)
app.get("/make-server-36ac7b49/admin/user-approvals", async (c) => {
  try {
    const approvals = await kv.getByPrefix("user_approval:");
    // Sort by requested_at, most recent first
    const sorted = (approvals || []).sort((a, b) => {
      return new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime();
    });
    return c.json(sorted);
  } catch (error) {
    console.error("Error fetching user approvals:", error);
    return c.json({ error: "Failed to fetch user approvals" }, 500);
  }
});

// Approve or reject user
app.post("/make-server-36ac7b49/admin/user-approval/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const body = await c.req.json();
    const { action, admin_email } = body; // action: 'approve' or 'reject'

    if (!action || !['approve', 'reject'].includes(action)) {
      return c.json({ error: "Invalid action. Use 'approve' or 'reject'" }, 400);
    }

    const approval = await kv.get(`user_approval:${userId}`);
    
    if (!approval) {
      return c.json({ error: "User approval record not found" }, 404);
    }

    const updated = {
      ...approval,
      status: action === 'approve' ? 'approved' : 'rejected',
      approved_at: getTimestamp(),
      approved_by: admin_email || 'admin',
    };

    await kv.set(`user_approval:${userId}`, updated);

    return c.json({ 
      success: true, 
      status: updated.status,
      message: `User ${action === 'approve' ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    console.error("Error updating user approval:", error);
    return c.json({ error: "Failed to update user approval" }, 500);
  }
});

// ============================================================================
// MASTER DATA ROUTES
// ============================================================================

// Product Categories
app.get("/make-server-36ac7b49/master/product-categories", async (c) => {
  try {
    const categories = await kv.getByPrefix("category:");
    return c.json(categories || []);
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return c.json({ error: "Failed to fetch product categories" }, 500);
  }
});

app.post("/make-server-36ac7b49/master/product-categories", async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || generateId();
    const category = {
      ...body,
      id,
      created_at: body.created_at || getTimestamp(),
      updated_at: getTimestamp(),
    };
    await kv.set(`category:${id}`, category);
    return c.json(category);
  } catch (error) {
    console.error("Error creating product category:", error);
    return c.json({ error: "Failed to create product category" }, 500);
  }
});

app.put("/make-server-36ac7b49/master/product-categories/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`category:${id}`);
    if (!existing) {
      return c.json({ error: "Category not found" }, 404);
    }
    const updated = {
      ...existing,
      ...body,
      id,
      updated_at: getTimestamp(),
    };
    await kv.set(`category:${id}`, updated);
    return c.json(updated);
  } catch (error) {
    console.error("Error updating product category:", error);
    return c.json({ error: "Failed to update product category" }, 500);
  }
});

app.delete("/make-server-36ac7b49/master/product-categories/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`category:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting product category:", error);
    return c.json({ error: "Failed to delete product category" }, 500);
  }
});

// Warehouse Zones
app.get("/make-server-36ac7b49/master/warehouse-zones", async (c) => {
  try {
    const zones = await kv.getByPrefix("zone:");
    return c.json(zones || []);
  } catch (error) {
    console.error("Error fetching warehouse zones:", error);
    return c.json({ error: "Failed to fetch warehouse zones" }, 500);
  }
});

app.post("/make-server-36ac7b49/master/warehouse-zones", async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || generateId();
    const zone = {
      ...body,
      id,
      created_at: body.created_at || getTimestamp(),
      updated_at: getTimestamp(),
    };
    await kv.set(`zone:${id}`, zone);
    return c.json(zone);
  } catch (error) {
    console.error("Error creating warehouse zone:", error);
    return c.json({ error: "Failed to create warehouse zone" }, 500);
  }
});

app.put("/make-server-36ac7b49/master/warehouse-zones/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`zone:${id}`);
    if (!existing) {
      return c.json({ error: "Zone not found" }, 404);
    }
    const updated = {
      ...existing,
      ...body,
      id,
      updated_at: getTimestamp(),
    };
    await kv.set(`zone:${id}`, updated);
    return c.json(updated);
  } catch (error) {
    console.error("Error updating warehouse zone:", error);
    return c.json({ error: "Failed to update warehouse zone" }, 500);
  }
});

app.delete("/make-server-36ac7b49/master/warehouse-zones/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`zone:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting warehouse zone:", error);
    return c.json({ error: "Failed to delete warehouse zone" }, 500);
  }
});

// Generic master data routes for other tables
const masterDataTypes = [
  "location-types",
  "units-of-measure",
  "statuses",
  "priority-levels",
  "order-types",
  "shipping-methods",
  "roles",
  "inspection-types",
  "defect-types",
  "hold-reasons",
  "system-config",
  "ble-gateways"
];

masterDataTypes.forEach(type => {
  const prefix = type.replace(/-/g, "_");
  
  app.get(`/make-server-36ac7b49/master/${type}`, async (c) => {
    try {
      const data = await kv.getByPrefix(`${prefix}:`);
      return c.json(data || []);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return c.json({ error: `Failed to fetch ${type}` }, 500);
    }
  });

  app.post(`/make-server-36ac7b49/master/${type}`, async (c) => {
    try {
      const body = await c.req.json();
      const id = body.id || generateId();
      const item = {
        ...body,
        id,
        created_at: body.created_at || getTimestamp(),
        updated_at: getTimestamp(),
      };
      await kv.set(`${prefix}:${id}`, item);
      return c.json(item);
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      return c.json({ error: `Failed to create ${type}` }, 500);
    }
  });

  app.put(`/make-server-36ac7b49/master/${type}/:id`, async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      const existing = await kv.get(`${prefix}:${id}`);
      if (!existing) {
        return c.json({ error: "Item not found" }, 404);
      }
      const updated = {
        ...existing,
        ...body,
        id,
        updated_at: getTimestamp(),
      };
      await kv.set(`${prefix}:${id}`, updated);
      return c.json(updated);
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      return c.json({ error: `Failed to update ${type}` }, 500);
    }
  });

  app.delete(`/make-server-36ac7b49/master/${type}/:id`, async (c) => {
    try {
      const id = c.req.param("id");
      await kv.del(`${prefix}:${id}`);
      return c.json({ success: true });
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      return c.json({ error: `Failed to delete ${type}` }, 500);
    }
  });
});

// ============================================================================
// PRODUCTS
// ============================================================================

app.get("/make-server-36ac7b49/products", async (c) => {
  try {
    const products = await kv.getByPrefix("product:");
    return c.json(products || []);
  } catch (error) {
    console.error("Error fetching products:", error);
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

app.get("/make-server-36ac7b49/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const product = await kv.get(`product:${id}`);
    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }
    return c.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return c.json({ error: "Failed to fetch product" }, 500);
  }
});

app.post("/make-server-36ac7b49/products", async (c) => {
  try {
    const body = await c.req.json();
    const id = generateId();
    const product = {
      ...body,
      id,
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      is_active: body.is_active !== undefined ? body.is_active : true,
      deleted_at: null,
    };
    await kv.set(`product:${id}`, product);
    return c.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return c.json({ error: "Failed to create product" }, 500);
  }
});

app.put("/make-server-36ac7b49/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`product:${id}`);
    if (!existing) {
      return c.json({ error: "Product not found" }, 404);
    }
    const updated = {
      ...existing,
      ...body,
      id,
      updated_at: getTimestamp(),
    };
    await kv.set(`product:${id}`, updated);
    return c.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    return c.json({ error: "Failed to update product" }, 500);
  }
});

app.delete("/make-server-36ac7b49/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`product:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return c.json({ error: "Failed to delete product" }, 500);
  }
});

// ============================================================================
// WAREHOUSE LOCATIONS
// ============================================================================

app.get("/make-server-36ac7b49/locations", async (c) => {
  try {
    const locations = await kv.getByPrefix("location:");
    return c.json(locations || []);
  } catch (error) {
    console.error("Error fetching locations:", error);
    return c.json({ error: "Failed to fetch locations" }, 500);
  }
});

app.post("/make-server-36ac7b49/locations", async (c) => {
  try {
    const body = await c.req.json();
    const id = generateId();
    const location = {
      ...body,
      id,
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      is_available: body.is_available !== undefined ? body.is_available : true,
      current_occupancy: body.current_occupancy || 0,
    };
    await kv.set(`location:${id}`, location);
    return c.json(location);
  } catch (error) {
    console.error("Error creating location:", error);
    return c.json({ error: "Failed to create location" }, 500);
  }
});

app.put("/make-server-36ac7b49/locations/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`location:${id}`);
    if (!existing) {
      return c.json({ error: "Location not found" }, 404);
    }
    const updated = {
      ...existing,
      ...body,
      id,
      updated_at: getTimestamp(),
    };
    await kv.set(`location:${id}`, updated);
    return c.json(updated);
  } catch (error) {
    console.error("Error updating location:", error);
    return c.json({ error: "Failed to update location" }, 500);
  }
});

app.delete("/make-server-36ac7b49/locations/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`location:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting location:", error);
    return c.json({ error: "Failed to delete location" }, 500);
  }
});

// ============================================================================
// BLE BEACONS
// ============================================================================

app.get("/make-server-36ac7b49/beacons", async (c) => {
  try {
    const beacons = await kv.getByPrefix("beacon:");
    return c.json(beacons || []);
  } catch (error) {
    console.error("Error fetching beacons:", error);
    return c.json({ error: "Failed to fetch beacons" }, 500);
  }
});

app.post("/make-server-36ac7b49/beacons", async (c) => {
  try {
    const body = await c.req.json();
    const id = generateId();
    const beacon = {
      ...body,
      id,
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      is_active: body.is_active !== undefined ? body.is_active : true,
      last_seen_at: getTimestamp(),
    };
    await kv.set(`beacon:${id}`, beacon);
    
    // Also log the scan event
    const scanEvent = {
      id: generateId(),
      beacon_id: id,
      mac_address: body.mac_address,
      signal_strength: body.signal_strength || -50,
      scan_type: "GENERAL",
      created_at: getTimestamp(),
    };
    await kv.set(`scan:${scanEvent.id}`, scanEvent);
    
    return c.json(beacon);
  } catch (error) {
    console.error("Error creating beacon:", error);
    return c.json({ error: "Failed to create beacon" }, 500);
  }
});

app.put("/make-server-36ac7b49/beacons/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`beacon:${id}`);
    if (!existing) {
      return c.json({ error: "Beacon not found" }, 404);
    }
    const updated = {
      ...existing,
      ...body,
      id,
      updated_at: getTimestamp(),
    };
    await kv.set(`beacon:${id}`, updated);
    return c.json(updated);
  } catch (error) {
    console.error("Error updating beacon:", error);
    return c.json({ error: "Failed to update beacon" }, 500);
  }
});

// ============================================================================
// INVENTORY
// ============================================================================

app.get("/make-server-36ac7b49/inventory", async (c) => {
  try {
    const inventory = await kv.getByPrefix("inventory:");
    return c.json(inventory || []);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return c.json({ error: "Failed to fetch inventory" }, 500);
  }
});

app.post("/make-server-36ac7b49/inventory", async (c) => {
  try {
    const body = await c.req.json();
    const id = generateId();
    const item = {
      ...body,
      id,
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      status: body.status || "AVAILABLE",
      received_date: body.received_date || getTimestamp(),
    };
    await kv.set(`inventory:${id}`, item);
    return c.json(item);
  } catch (error) {
    console.error("Error creating inventory:", error);
    return c.json({ error: "Failed to create inventory" }, 500);
  }
});

app.put("/make-server-36ac7b49/inventory/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`inventory:${id}`);
    if (!existing) {
      return c.json({ error: "Inventory not found" }, 404);
    }
    const updated = {
      ...existing,
      ...body,
      id,
      updated_at: getTimestamp(),
    };
    await kv.set(`inventory:${id}`, updated);
    return c.json(updated);
  } catch (error) {
    console.error("Error updating inventory:", error);
    return c.json({ error: "Failed to update inventory" }, 500);
  }
});

// ============================================================================
// PUT-AWAY TASKS
// ============================================================================

app.get("/make-server-36ac7b49/putaway-tasks", async (c) => {
  try {
    const tasks = await kv.getByPrefix("putaway:");
    return c.json(tasks || []);
  } catch (error) {
    console.error("Error fetching put-away tasks:", error);
    return c.json({ error: "Failed to fetch put-away tasks" }, 500);
  }
});

app.post("/make-server-36ac7b49/putaway-tasks", async (c) => {
  try {
    const body = await c.req.json();
    const id = generateId();
    const task = {
      ...body,
      id,
      task_number: body.task_number || `PA-${Date.now()}`,
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      status: body.status || "PENDING",
      step_completed: body.step_completed || 0,
      location_verified: body.location_verified || false,
    };
    await kv.set(`putaway:${id}`, task);
    return c.json(task);
  } catch (error) {
    console.error("Error creating put-away task:", error);
    return c.json({ error: "Failed to create put-away task" }, 500);
  }
});

app.put("/make-server-36ac7b49/putaway-tasks/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`putaway:${id}`);
    if (!existing) {
      return c.json({ error: "Put-away task not found" }, 404);
    }
    const updated = {
      ...existing,
      ...body,
      id,
      updated_at: getTimestamp(),
    };
    await kv.set(`putaway:${id}`, updated);
    return c.json(updated);
  } catch (error) {
    console.error("Error updating put-away task:", error);
    return c.json({ error: "Failed to update put-away task" }, 500);
  }
});

// ============================================================================
// TAKE-AWAY ORDERS
// ============================================================================

app.get("/make-server-36ac7b49/takeaway-orders", async (c) => {
  try {
    const orders = await kv.getByPrefix("takeaway:");
    return c.json(orders || []);
  } catch (error) {
    console.error("Error fetching take-away orders:", error);
    return c.json({ error: "Failed to fetch take-away orders" }, 500);
  }
});

app.post("/make-server-36ac7b49/takeaway-orders", async (c) => {
  try {
    const body = await c.req.json();
    const id = generateId();
    const order = {
      ...body,
      id,
      order_number: body.order_number || `TA-${Date.now()}`,
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      status: body.status || "PENDING",
    };
    await kv.set(`takeaway:${id}`, order);
    return c.json(order);
  } catch (error) {
    console.error("Error creating take-away order:", error);
    return c.json({ error: "Failed to create take-away order" }, 500);
  }
});

app.put("/make-server-36ac7b49/takeaway-orders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`takeaway:${id}`);
    if (!existing) {
      return c.json({ error: "Take-away order not found" }, 404);
    }
    const updated = {
      ...existing,
      ...body,
      id,
      updated_at: getTimestamp(),
    };
    await kv.set(`takeaway:${id}`, updated);
    return c.json(updated);
  } catch (error) {
    console.error("Error updating take-away order:", error);
    return c.json({ error: "Failed to update take-away order" }, 500);
  }
});

// ============================================================================
// QC INSPECTIONS
// ============================================================================

app.get("/make-server-36ac7b49/qc-inspections", async (c) => {
  try {
    const inspections = await kv.getByPrefix("qc:");
    return c.json(inspections || []);
  } catch (error) {
    console.error("Error fetching QC inspections:", error);
    return c.json({ error: "Failed to fetch QC inspections" }, 500);
  }
});

app.post("/make-server-36ac7b49/qc-inspections", async (c) => {
  try {
    const body = await c.req.json();
    const id = generateId();
    const inspection = {
      ...body,
      id,
      inspection_number: body.inspection_number || `QC-${Date.now()}`,
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      status: body.status || "PENDING",
      quantity_passed: body.quantity_passed || 0,
      quantity_failed: body.quantity_failed || 0,
    };
    await kv.set(`qc:${id}`, inspection);
    return c.json(inspection);
  } catch (error) {
    console.error("Error creating QC inspection:", error);
    return c.json({ error: "Failed to create QC inspection" }, 500);
  }
});

app.put("/make-server-36ac7b49/qc-inspections/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`qc:${id}`);
    if (!existing) {
      return c.json({ error: "QC inspection not found" }, 404);
    }
    const updated = {
      ...existing,
      ...body,
      id,
      updated_at: getTimestamp(),
    };
    await kv.set(`qc:${id}`, updated);
    return c.json(updated);
  } catch (error) {
    console.error("Error updating QC inspection:", error);
    return c.json({ error: "Failed to update QC inspection" }, 500);
  }
});

// ============================================================================
// HOLD ITEMS
// ============================================================================

app.get("/make-server-36ac7b49/hold-items", async (c) => {
  try {
    const items = await kv.getByPrefix("hold:");
    return c.json(items || []);
  } catch (error) {
    console.error("Error fetching hold items:", error);
    return c.json({ error: "Failed to fetch hold items" }, 500);
  }
});

app.post("/make-server-36ac7b49/hold-items", async (c) => {
  try {
    const body = await c.req.json();
    const id = generateId();
    const item = {
      ...body,
      id,
      hold_number: body.hold_number || `HOLD-${Date.now()}`,
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      placed_at: getTimestamp(),
    };
    await kv.set(`hold:${id}`, item);
    return c.json(item);
  } catch (error) {
    console.error("Error creating hold item:", error);
    return c.json({ error: "Failed to create hold item" }, 500);
  }
});

app.put("/make-server-36ac7b49/hold-items/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`hold:${id}`);
    if (!existing) {
      return c.json({ error: "Hold item not found" }, 404);
    }
    const updated = {
      ...existing,
      ...body,
      id,
      updated_at: getTimestamp(),
    };
    await kv.set(`hold:${id}`, updated);
    return c.json(updated);
  } catch (error) {
    console.error("Error updating hold item:", error);
    return c.json({ error: "Failed to update hold item" }, 500);
  }
});

// Health check endpoint
app.get("/make-server-36ac7b49/health", (c) => {
  return c.json({ status: "ok", timestamp: getTimestamp() });
});

Deno.serve(app.fetch);