export class MyArrivals {
  constructor(page) {
    this.page = page;
 
    // Locators
    this.manageBookingText = this.page.getByText('Manage Booking');
    this.myArrivalsLink = this.page.getByRole('link', { name: 'My Arrivals', exact: true });
  }
 
  async navigateToMyArrivals() {
    await this.manageBookingText.click();
    await this.myArrivalsLink.click();
  }
}