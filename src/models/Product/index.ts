import { Sequelize } from "sequelize";
import CartFactory, { Cart } from "./Cart";
import CartItemFactory, { CartItem } from "./CartItem";
import ProductFactory, { Product } from "./Product";
import OrderFactory, { Order } from "./Order";
import OrderItemFactory, { OrderItem } from "./OrderItem";
import PaymentFactory, { Payment } from "./Payment";
import { User } from "../User";

const ProductModels = (sequelize: Sequelize) => {
  ProductFactory(sequelize);
  CartFactory(sequelize);
  CartItemFactory(sequelize);
  OrderFactory(sequelize);
  OrderItemFactory(sequelize);
  PaymentFactory(sequelize);

  // User - Cart (1:Many)
  User.hasMany(Cart, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Cart.belongsTo(User, {
    foreignKey: "user_id",
  });

  // Cart - CartItem (1:Many)
  Cart.hasMany(CartItem, {
    foreignKey: "cart_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  CartItem.belongsTo(Cart, {
    foreignKey: "cart_id",
  });

  // Product - CartItem (1:Many)
  Product.hasMany(CartItem, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  CartItem.belongsTo(Product, {
    foreignKey: "product_id",
  });

  // User - Order (1:Many)
  User.hasMany(Order, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Order.belongsTo(User, {
    foreignKey: "user_id",
  });

  // Cart - Order (1:1)
  Cart.hasOne(Order, {
    foreignKey: "cart_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Order.belongsTo(Cart, {
    foreignKey: "cart_id",
  });

  // Order - OrderItem (1:Many)
  Order.hasMany(OrderItem, {
    foreignKey: "order_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  OrderItem.belongsTo(Order, {
    foreignKey: "order_id",
  });

  // Product - OrderItem (1:Many)
  Product.hasMany(OrderItem, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  OrderItem.belongsTo(Product, {
    foreignKey: "product_id",
  });

  // User - Payment (1:Many)
  User.hasMany(Payment, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Payment.belongsTo(User, {
    foreignKey: "user_id",
  });

  // Order - Payment (1:Many)
  Order.hasMany(Payment, {
    foreignKey: "order_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Payment.belongsTo(Order, {
    foreignKey: "order_id",
  });
};

export default ProductModels;
export { Product, Cart, CartItem, Order, OrderItem, Payment };
