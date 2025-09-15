// backend/src/types/enums.ts

export enum UserRole {
  CLIENT = 'client',
  TRANSITAIRE = 'transitaire',
  ADMIN = 'admin',
}

export enum SubscriptionPlan {
  STARTER = 'starter',
  BUSINESS = 'business',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELED = 'canceled',
  PENDING_PAYMENT = 'pending_payment',
}