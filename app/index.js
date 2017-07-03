import 'styles/index.scss';
import _ from 'lodash';
import numeral from 'numeral';

class InvoiceApp {
  
  constructor() {
    this.invoices = [];
    this.table = document.getElementById('invoice-table');
    this.tableHeads = document.getElementsByTagName('th');
    this.tableRows = document.getElementsByClassName('tr-result');
    this.detailContainer = document.getElementById('detail-container');
    this.currentOrderOfSortField = 'desc';
    this.selectedInvoiceId = 1;
    this.getAllInvoices();
    this.sortSetup();

  }
  
  getAllInvoices() {
    $.getJSON("./assets/invoices.json", (data) => {
      data.forEach((invoice) => {
        this.invoices.push(invoice);
      });
      this.populateTable(this.invoices);
    });
  }
  
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
  
    for (const tableRow of this.tableRows) {
      tableRow.addEventListener('click', (e) => {
        this.selectedInvoiceId = e.currentTarget.dataset.id;
        this.renderDetailView(this.selectedInvoiceId);
        
        this.closeButton = document.getElementById('close-button');
        this.closeButton.addEventListener('click', () => {
          this.detailContainer.style.animation = 'away 1s';
          setTimeout(() => {
            this.detailContainer.innerHTML = '';
            this.detailContainer.style.animation = '';
          }, 1000);
        });
      })
    }
  }
  
  sortSetup() {
    for (const tableHead of this.tableHeads) {
      tableHead.addEventListener('click', (e) => {
        this.currentSortField = _.camelCase(e.target.innerText);
        this.currentOrderOfSortField = (this.currentOrderOfSortField === 'desc') ? 'asc' : 'desc';
        this.sortTable(this.currentSortField, this.currentOrderOfSortField);
      })
    }
  }
  
  sortTable(sortBy, order) {
    const sortedInvoices = _.orderBy(this.invoices, [o => o[sortBy]], [order]);
    this.populateTable(sortedInvoices);
  }
  
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
}

const App = new InvoiceApp();







