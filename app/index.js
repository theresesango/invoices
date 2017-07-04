import 'styles/index.scss';
import _ from 'lodash';
import numeral from 'numeral';

class InvoiceApp {
  // Initial state
  constructor() {
    this.invoices = [];
    this.table = document.getElementById('invoice-table');
    this.tableHeads = document.getElementsByTagName('th');
    this.tableRows = document.getElementsByClassName('tr-result');
    this.detailContainer = document.getElementById('detail-container');
    this.menuButton = document.getElementById('menu-button');
    this.nav = document.getElementById('nav');
    this.currentOrderOfSortField = 'desc';
    this.isMenuCollaps = false;
    this.selectedInvoiceId = 1;
    this.getAllInvoices();
    this.sortSetup();
    
    // Handels menu animations
    this.menuButton.addEventListener('click', (e) => {
      if (!this.isMenuCollaps) {
        e.currentTarget.className = 'show';
        this.nav.className = 'show';
        this.isMenuCollaps = true;
      } else {
        e.currentTarget.className = 'hide';
        this.nav.className = '';
        this.isMenuCollaps = false;
      }
      return false;
    })
  }
  // Gets all invoices from invoices.json and populate the main table
  getAllInvoices() {
    $.getJSON("./assets/invoices.json", (data) => {
      data.forEach((invoice) => {
        this.invoices.push(invoice);
      });
      this.populateTable(this.invoices);
    });
  }
  
  // Populates main table with invoice information
  populateTable(arr) {
    this.table.innerHTML = '';
    arr.forEach((invoice) => {
      let tableRow = document.createElement('tr');
      tableRow.className = "tr-result";
      tableRow.dataset.id = invoice.id;
      tableRow.innerHTML = `
        <td>${invoice.type}</td>
        <td>${invoice.accountName}</td>
        <td>${invoice.status}</td>
        <td>${invoice.currency}</td>
        <td>$ ${numeral(invoice.balance).format('0,0.00')}</td>
      `;
      this.table.appendChild(tableRow);
    });
    
    // Gets the selected invoices id to render detail view
    for (const tableRow of this.tableRows) {
      tableRow.addEventListener('click', (e) => {
        this.selectedInvoiceId = e.currentTarget.dataset.id;
        this.renderDetailView(this.selectedInvoiceId);
        
        // Closing details view
        this.closeButton = document.getElementById('close-button');
        this.closeButton.addEventListener('click', () => {
          this.detailContainer.style.animation = 'disappear 1s';
          // awaits the animation before remove
          setTimeout(() => {
            this.detailContainer.innerHTML = '';
            this.detailContainer.style.animation = '';
          }, 1000);
        });
      })
    }
  }
    
  // Detail view template
  renderDetailView(selectedInvoiceId) {
    this.detailContainer.innerHTML = '';
    let selectedInvoice = _.find(this.invoices, ['id', selectedInvoiceId ]);
    
    this.detailContainer.innerHTML =
      `<div class="content">
        <img src="./assets/images/trump-${selectedInvoice.img}.jpg">
        <div>
          <h2>${selectedInvoice.accountName}</h2>
          <ul>
            <li><label>Type</label><p>${selectedInvoice.type}</p></li>
            <li><label>Account Name</label><p>${selectedInvoice.accountName}</p></li>
            <li><label>Status</label><p>${selectedInvoice.status}</p></li>
            <li><label>Currency</label><p>${selectedInvoice.currency}</p></li>
            <li><label>Balance</label><p>${selectedInvoice.balance}</p></li>
            <li><label>Note</label><p>${selectedInvoice.note}</p></li>
          </ul>
        </div>
      </div>
      <div><a id="close-button"><i class="fa fa-times" aria-hidden="true"></i></a></div>`;
  }
  
  // Adds eventlisteners to table heads for sorting
  sortSetup() {
    for (const tableHead of this.tableHeads) {
      tableHead.addEventListener('click', (e) => {
        this.currentSortField = _.camelCase(e.target.innerText);
        this.currentOrderOfSortField = (this.currentOrderOfSortField === 'desc') ? 'asc' : 'desc';
        this.sortTable(this.currentSortField, this.currentOrderOfSortField);
      })
    }
  }
  
  // Sorts the table depending on which button was pressed
  // and if it should be asc or desc
  sortTable(sortBy, order) {
    const sortedInvoices = _.orderBy(this.invoices, [o => o[sortBy]], [order]);
    this.populateTable(sortedInvoices);
  }
}

const App = new InvoiceApp();







