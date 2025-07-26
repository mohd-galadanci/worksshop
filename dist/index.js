var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  cartItems: () => cartItems,
  insertCartItemSchema: () => insertCartItemSchema,
  insertOrderItemSchema: () => insertOrderItemSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertProductSchema: () => insertProductSchema,
  orderItems: () => orderItems,
  orders: () => orders,
  products: () => products,
  sessions: () => sessions,
  users: () => users
});
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phoneNumber: varchar("phone_number"),
  ippisNumber: varchar("ippis_number"),
  creditLimit: decimal("credit_limit", { precision: 10, scale: 2 }).default("300000.00"),
  availableCredit: decimal("available_credit", { precision: 10, scale: 2 }).default("300000.00"),
  usedCredit: decimal("used_credit", { precision: 10, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar("image_url"),
  category: varchar("category", { length: 100 }),
  inStock: boolean("in_stock").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  deliveryAddress: text("delivery_address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertProductSchema = createInsertSchema(products);
var insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });
var insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true, createdAt: true });
var insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true, createdAt: true, updatedAt: true });

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, sql } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  // Product operations
  async getAllProducts() {
    return await db.select().from(products).where(eq(products.inStock, true));
  }
  async getProductById(id) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  async createProduct(product) {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  // Cart operations
  async getCartItems(userId) {
    const result = await db.select({
      id: cartItems.id,
      userId: cartItems.userId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      createdAt: cartItems.createdAt,
      updatedAt: cartItems.updatedAt,
      product: products
    }).from(cartItems).innerJoin(products, eq(cartItems.productId, products.id)).where(eq(cartItems.userId, userId));
    return result;
  }
  async addToCart(cartItem) {
    const [existingItem] = await db.select().from(cartItems).where(
      sql`${cartItems.userId} = ${cartItem.userId} AND ${cartItems.productId} = ${cartItem.productId}`
    );
    if (existingItem) {
      const [updatedItem] = await db.update(cartItems).set({
        quantity: existingItem.quantity + cartItem.quantity,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(cartItems.id, existingItem.id)).returning();
      return updatedItem;
    } else {
      const [newItem] = await db.insert(cartItems).values(cartItem).returning();
      return newItem;
    }
  }
  async updateCartItem(id, quantity) {
    const [updatedItem] = await db.update(cartItems).set({ quantity, updatedAt: /* @__PURE__ */ new Date() }).where(eq(cartItems.id, id)).returning();
    return updatedItem;
  }
  async removeFromCart(id) {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }
  async clearCart(userId) {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }
  // Order operations
  async createOrder(order, items) {
    return await db.transaction(async (tx) => {
      const [newOrder] = await tx.insert(orders).values(order).returning();
      const orderItemsWithOrderId = items.map((item) => ({
        ...item,
        orderId: newOrder.id
      }));
      await tx.insert(orderItems).values(orderItemsWithOrderId);
      await tx.update(users).set({
        usedCredit: sql`${users.usedCredit} + ${order.totalAmount}`,
        availableCredit: sql`${users.availableCredit} - ${order.totalAmount}`,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users.id, order.userId));
      return newOrder;
    });
  }
  async getUserOrders(userId) {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }
  async getOrderById(id) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  // Credit operations
  async updateUserCredit(userId, usedAmount) {
    const [updatedUser] = await db.update(users).set({
      usedCredit: sql`${users.usedCredit} + ${usedAmount}`,
      availableCredit: sql`${users.availableCredit} - ${usedAmount}`,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(users.id, userId)).returning();
    return updatedUser;
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  await setupAuth(app2);
  await seedProducts();
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/products", async (req, res) => {
    try {
      const products2 = await storage.getAllProducts();
      res.json(products2);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.get("/api/cart", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItems2 = await storage.getCartItems(userId);
      res.json(cartItems2);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });
  app2.post("/api/cart", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId
      });
      const cartItem = await storage.addToCart(cartItemData);
      res.json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });
  app2.put("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      const updatedItem = await storage.updateCartItem(id, quantity);
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });
  app2.delete("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeFromCart(id);
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });
  app2.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { deliveryAddress } = req.body;
      const cartItems2 = await storage.getCartItems(userId);
      if (cartItems2.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      const totalAmount = cartItems2.reduce((sum, item) => {
        return sum + parseFloat(item.product.price) * item.quantity;
      }, 0);
      const user = await storage.getUser(userId);
      if (!user || parseFloat(user.availableCredit) < totalAmount) {
        return res.status(400).json({ message: "Insufficient credit limit" });
      }
      const orderData = insertOrderSchema.parse({
        userId,
        totalAmount: totalAmount.toString(),
        deliveryAddress,
        status: "pending"
      });
      const orderItemsData = cartItems2.map(
        (item) => insertOrderItemSchema.parse({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price
        })
      );
      const order = await storage.createOrder(orderData, orderItemsData);
      await storage.clearCart(userId);
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  app2.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders2 = await storage.getUserOrders(userId);
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.put("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { phoneNumber, ippisNumber } = req.body;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const updatedUser = await storage.upsertUser({
        ...user,
        phoneNumber,
        ippisNumber,
        updatedAt: /* @__PURE__ */ new Date()
      });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}
async function seedProducts() {
  try {
    const existingProducts = await storage.getAllProducts();
    if (existingProducts.length > 0) {
      return;
    }
    const products2 = [
      {
        name: "Fresh Tomatoes",
        description: "Premium quality Roma tomatoes - 1kg",
        price: "2500.00",
        imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Fruits & Vegetables",
        inStock: true
      },
      {
        name: "Indomie Instant Noodles",
        description: "Chicken flavour instant noodles - pack of 5",
        price: "1200.00",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Instant Foods",
        inStock: true
      },
      {
        name: "Golden Penny Macaroni",
        description: "Premium macaroni pasta - 500g pack",
        price: "800.00",
        imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Instant Foods",
        inStock: true
      },
      {
        name: "Local Rice",
        description: "Premium Abakaliki rice - 5kg bag",
        price: "8500.00",
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Rice & Grains",
        inStock: true
      },
      {
        name: "Fresh Chicken",
        description: "Whole chicken - cleaned and fresh",
        price: "5200.00",
        imageUrl: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Proteins",
        inStock: true
      },
      {
        name: "Ripe Plantain",
        description: "Sweet ripe plantains - bunch of 5",
        price: "1800.00",
        imageUrl: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Fruits & Vegetables",
        inStock: true
      },
      {
        name: "Maggi Seasoning Cubes",
        description: "Chicken flavour seasoning - 50 cubes",
        price: "600.00",
        imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Seasonings",
        inStock: true
      },
      {
        name: "Peak Milk",
        description: "Full cream powdered milk - 400g tin",
        price: "3200.00",
        imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Dairy & Beverages",
        inStock: true
      },
      {
        name: "Yam Tuber",
        description: "Large fresh yam tuber - 2kg",
        price: "3500.00",
        imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Fruits & Vegetables",
        inStock: true
      },
      {
        name: "Semovita",
        description: "Golden Penny Semovita - 1kg pack",
        price: "1500.00",
        imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Rice & Grains",
        inStock: true
      },
      {
        name: "Palm Oil",
        description: "Pure red palm oil - 1 liter bottle",
        price: "2200.00",
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Cooking Oils",
        inStock: true
      },
      {
        name: "Brown Beans",
        description: "Quality brown beans - 2kg pack",
        price: "4200.00",
        imageUrl: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Rice & Grains",
        inStock: true
      },
      {
        name: "Coca-Cola",
        description: "Soft drinks - pack of 6 bottles",
        price: "3600.00",
        imageUrl: "https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Dairy & Beverages",
        inStock: true
      },
      {
        name: "Groundnut Oil",
        description: "Pure groundnut cooking oil - 1 liter",
        price: "1800.00",
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Cooking Oils",
        inStock: true
      },
      {
        name: "Gari",
        description: "Premium white garri - 2kg pack",
        price: "2000.00",
        imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Rice & Grains",
        inStock: true
      },
      {
        name: "Dano Milk",
        description: "Full cream instant milk powder - 400g",
        price: "2800.00",
        imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Dairy & Beverages",
        inStock: true
      },
      {
        name: "Milo Chocolate Drink",
        description: "Nestle Milo energy drink - 400g tin",
        price: "3500.00",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Dairy & Beverages",
        inStock: true
      },
      {
        name: "Honeywell Noodles",
        description: "Chicken pepper soup flavour - pack of 5",
        price: "1100.00",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Instant Foods",
        inStock: true
      },
      {
        name: "Knorr Seasoning",
        description: "Chicken seasoning cubes - 50 pieces",
        price: "750.00",
        imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Seasonings",
        inStock: true
      },
      {
        name: "Sardines",
        description: "Geisha canned sardines in tomato sauce",
        price: "900.00",
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Proteins",
        inStock: true
      },
      {
        name: "Sweet Potato",
        description: "Fresh sweet potatoes - 2kg",
        price: "2500.00",
        imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Fruits & Vegetables",
        inStock: true
      },
      {
        name: "Lipton Tea",
        description: "Yellow label tea bags - 100 pieces",
        price: "1600.00",
        imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Dairy & Beverages",
        inStock: true
      }
    ];
    for (const product of products2) {
      await storage.createProduct(product);
    }
    console.log("Products seeded successfully");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
