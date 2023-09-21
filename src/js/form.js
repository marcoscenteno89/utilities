export default class Form {
  // TO-DO add functionality so the form will only submit the action
  // TO-DO Generate steps, previous, next, status, and controller elements dynamically
  constructor(form, formCompletedCallback=false, tabChangeCallback=false) {
    this.form = form;
    this.tabChangeCallback = tabChangeCallback;
    this.formCompleteCallback = formCompletedCallback;
    this.action = form.action;
    this.status = form.querySelector(".status");
    this.tabList = [];
    this.values = {}
    this.currentTab = 0;
    this.previousTab;
    this.controller = form.querySelector('.controller');
    this.next = form.querySelector('button[name="next"]');
    this.previous = form.querySelector('button[name="prev"]');
    this.loader = new Loader(this.next, 3);

    this.init();
  }
  init() {
    let tabListNode = this.form.querySelectorAll(".tab");
    this.next.setAttribute('data-text', this.next.innerHTML);

    tabListNode.forEach( (tab, i) => {
      let name = tab.getAttribute('data-name');
      tab.id = `id-${name.toLowerCase().replace(' ', '-')}`;
      this.tabList.push({
        valid: true,
        index: i,
        name: name,
        tab: tab,
        values: {}
      });
      let width = `style="flex: 0 1 ${100 / tabListNode.length}%;"`;
      let step = tabListNode.length > 1 ? `${(i + 1)}.` : '';
      this.form.querySelector('.steps').insertAdjacentHTML("beforeend", `
        <div ${width} class="step step-${i} flex-col" data-step="${i}">
          <span class="number">${step}</span>
          <span class="title">${name.toUpperCase()}</span>
        </div>
      `);
    });

    
    for (i of this.controller.children) {
      i.style.width = `${100 / controllerChildren.length}%`;
    }

    // SETUP EVENT LISTENERS
    this.form.querySelectorAll('.step').forEach((step, i) => {
      this.tabList[i].step = step;
      step.addEventListener('click', (event) => this.changeTab(event));
    });
    
    this.next.addEventListener('click', (event) => this.changeTab(event));
    if (this.previous) {
      this.previous.addEventListener('click', (event) => this.changeTab(event));
      // this.previous.style.width = '50%';
      // this.next.style.width = '50%';
    }
    this.showNewTab(this.currentTab);
  }

  formAction() {
    const params = new URLSearchParams(this.values)
    const url = new URL(`${this.action}?${params.toString()}`);
    location.href = url;
  }
  
  validateData() {
    let fieldList = this.tabList[this.currentTab].tab.querySelectorAll('.form-input');
    this.tabList[this.currentTab].valid = true; // RESET TAB VALIDITY
    this.status.innerHTML = '';
    let msg = '';
    let issues = 0;
    fieldList.forEach(field => {
      if (field.type !== 'hidden') {
        if (field.validity.valid) {
          field.classList.add('success');
        } else {
          issues++;
          field.classList.add('warning');
          msg += `<div>${field.getAttribute('placeholder')}: ${field.validationMessage}</div>`;
        }
      }
    });
    if (issues > 0) {
      this.tabList[this.currentTab].valid = false;
      this.status.innerHTML = msgError(msg);
      return false;
    }
    fieldList.forEach(field => {
      this.values[field.name] = field.value;
      this.tabList[this.currentTab].values[field.name] = field.value;
    });
  }

  showNewTab() {
    this.tabList[this.currentTab].tab.style.display = "flex";
    this.next.setAttribute("data-step", this.currentTab + 1); 
  
    if (this.previous) {
      this.previous.disabled = (this.currentTab === 0) ? true : false;
      this.previous.setAttribute("data-step", this.currentTab - 1);
    }

    if (this.tabList.length > 1) {
      let last = this.tabList.length - 1;
      let next = this.next;
      next.innerHTML = this.currentTab === last ? 'Submit' : next.getAttribute('data-text');
    }
    
    if (this.tabList[this.currentTab].step) {
        this.tabList[this.currentTab].step.classList.add('active');
    }
  }

  clearPreviousTab() {
    if (this.tabList[this.previousTab]) {
      this.tabList[this.previousTab].step.classList.remove('active');
      this.tabList[this.previousTab].step.classList.add('completed');
      this.tabList[this.previousTab].tab.style.display = 'none';
    }
  }

  async changeTab(event) {
    this.loader.on()
    let nextStep = parseInt(event.target.getAttribute('data-step'));
    if (this.currentTab < nextStep) this.validateData();

    if (!this.tabList[this.currentTab].valid) {
      this.loader.off();
      return false;
    }
    // reached last step
    if (nextStep >= this.tabList.length) {

      // Run finished form callback, if it does not exists the form will default to 
      // the form action.
      // USER MUST GIVE ONE OR THE OTHER.
      if (this.formCompleteCallback) {
        await this.formCompleteCallback(this, this.values);
      } else {
        this.formAction();
      }
      
      this.loader.off();
      return false;
    }

    // Run custom callback if it exists
    if (this.tabChangeCallback) {
      await this.tabChangeCallback(this, this.tabList[this.currentTab].values);
    }
    
    this.previousTab = this.currentTab;
    this.currentTab = nextStep;
    this.clearPreviousTab();
    this.showNewTab();
    this.loader.off();
  }
}