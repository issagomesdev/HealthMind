import { SubscriptionPlan } from "../../core/types";

// Future: GET /subscription, POST /subscription/upgrade

class SubscriptionServiceImpl {
  private plan: SubscriptionPlan = "PREMIUM";
  private renewsInDays = 15;

  async getCurrentPlan(): Promise<{ plan: SubscriptionPlan; renewsInDays: number }> {
    await new Promise((r) => setTimeout(r, 200));
    return { plan: this.plan, renewsInDays: this.renewsInDays };
  }

  async upgradePlan(): Promise<void> {
    await new Promise((r) => setTimeout(r, 800));
    this.plan = "PREMIUM";
  }
}

export const SubscriptionService = new SubscriptionServiceImpl();
