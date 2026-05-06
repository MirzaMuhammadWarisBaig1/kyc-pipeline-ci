export class LoadSheet {
  constructor(page) {
    this.page = page;

    // Navigation locators
    this.manageBooking = page.getByText('Manage Booking', { exact: true });
    this.manageBookedPackets = page.getByRole('link', { name: 'Manage Booked Packets' });
    this.generateLoadSheet = page.getByRole('link', { name: 'Generate LoadSheet' });

    // Form locators
    this.fromDate = page.locator('#from');
    this.toDate = page.locator('#to');
    this.shipperContainer = page.locator('#select2-shipper-container');
    this.shipperSelf = page.getByRole('treeitem', { name: 'Self' });
    this.courierName = page.locator('#courier_name');
    this.courierCode = page.locator('#courier_code');
    this.selectAllCheckbox = page.locator('#selectAllCheckbox');
    this.processLoadSheetBtn = page.getByRole('button', { name: 'Process LoadSheet' });
    this.submitBtn = page.getByRole('button', { name: 'Submit' });
    this.printBtn = page.getByRole('button', { name: 'Print' });
  }

  async waitForLoader() {
    await this.page.waitForFunction(() => {
      const loader = document.querySelector('#leopard_loader');
      return !loader || getComputedStyle(loader).display === 'none' || loader.style.display === 'none';
    }, { timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  async navigateToLoadSheet() {
    await this.manageBooking.click();
    await this.manageBookedPackets.waitFor({ state: 'visible', timeout: 10000 });
    await this.manageBookedPackets.click();
    await this.generateLoadSheet.waitFor({ state: 'visible', timeout: 10000 });
    await this.generateLoadSheet.click();
    await this.waitForLoader();
  }

  async fillDateRange(fromDate, toDate) {
    await this.fromDate.fill(fromDate);
    await this.toDate.fill(toDate);
  }

  async selectShipper() {
    await this.shipperContainer.click();
    await this.shipperSelf.click();
  }

  async fillCourierDetails(name, code) {
    await this.courierName.fill(name);
    await this.courierCode.fill(code);
  }

  async selectPackets() {
    await this.selectAllCheckbox.uncheck();

    // Select first 3 checkboxes from tbody rows
    const rowCheckboxes = this.page.locator('tbody tr').getByRole('checkbox');
    for (let i = 0; i < 3; i++) {
      const checkbox = rowCheckboxes.nth(i);
      await checkbox.waitFor({ state: 'visible', timeout: 10000 });
      await checkbox.check();
    }
  }

  async processAndPrint() {
    await this.processLoadSheetBtn.click();
    await this.submitBtn.click();
    const popupPromise = this.page.waitForEvent('popup');
    await this.printBtn.click();
    return await popupPromise;
  }

  async generateLoadSheetFlow(fromDate, toDate, courierName, courierCode) {
    await this.navigateToLoadSheet();
    await this.fillDateRange(fromDate, toDate);
    await this.selectShipper();
    await this.fillCourierDetails(courierName, courierCode);
    await this.selectPackets();
    return await this.processAndPrint();
  }
}