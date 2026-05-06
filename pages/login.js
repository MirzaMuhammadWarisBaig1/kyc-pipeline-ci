export class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://ecomstaging.leopardscourier.com/login');
  }

  async waitForLoadersToHide() {
    await this.page.waitForFunction(() => {
      const loader1 = document.querySelector('#leopard_loader');
      const loader2 = document.querySelector('#globalLoader .loader-backdrop');
      const l1Hidden = !loader1 || loader1.style.display === 'none' || !loader1.offsetParent;
      const l2Hidden = !loader2 || loader2.style.display === 'none' || !loader2.offsetParent;
      return l1Hidden && l2Hidden;
    }, { timeout: 15000 }).catch(() => {});
  }

  async closeModalById(modalId) {
    const modal = this.page.locator(`#${modalId}`);
    try {
      await modal.waitFor({ state: 'visible', timeout: 5000 });

      // Use JS click to bypass any overlapping elements (like the merchant.jpg image)
      await this.page.evaluate((id) => {
        const modal = document.querySelector(`#${id}`);
        if (!modal) return;
        const btn = modal.querySelector('button[data-dismiss="modal"], button.btn-close, button.close');
        if (btn) btn.click();
      }, modalId);

      await modal.waitFor({ state: 'hidden', timeout: 5000 });
      await this.page.waitForTimeout(300);
    } catch (e) {
      // Modal not found or already closed
    }
  }

  async closeAllModals() {
    await this.closeModalById('loginModal');
    await this.closeModalById('pictureModal');
    await this.closeModalById('nTNCNICModal');

    // Catch any remaining unexpected modals using JS click to avoid overlay issues
    for (let i = 0; i < 5; i++) {
      const anyModal = this.page.locator('.modal.show');
      const isVisible = await anyModal.first().isVisible().catch(() => false);
      if (!isVisible) break;

      const closed = await this.page.evaluate(() => {
        const modal = document.querySelector('.modal.show');
        if (!modal) return false;
        const btn = modal.querySelector('button[data-dismiss="modal"], button.btn-close, button.close');
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      });

      if (!closed) break;
      await this.page.waitForTimeout(500);
    }
  }

  async login(userId, password) {
    await this.goto();
    await this.page.getByText('Ecom Login', { exact: true }).click();
    await this.page.getByRole('textbox', { name: 'User Id' }).fill(userId);
    await this.page.getByRole('textbox', { name: 'Your password...' }).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();

    // Wait for dashboard to load
    await this.page.waitForURL('**/dashboard', { timeout: 15000 });

    // Wait for loaders then close all modals
    await this.waitForLoadersToHide();
    await this.closeAllModals();
    await this.waitForLoadersToHide();
    await this.page.waitForTimeout(500);
  }

  async loginWithDefaults() {
    await this.login('999888', '12345678');
  }
}