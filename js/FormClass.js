export class Form {
   constructor(formClass) {
      this.form = document.querySelector(`.${formClass}`);
      this.formData = Object.fromEntries(new FormData(this.form));
   }

   init() {
      this.initSubmit();
      this.initTextInputs();
      this.initRadioInputs();
      this.initCheckboxInput();
   }

   initTextInputs() {
      const textNodes = this.form.querySelectorAll('input:is([type="text"],[type="email"]), textarea');
 
      for(const node of textNodes) {
         node.addEventListener('blur',() => {
            this.updateFormData();
            this.validateInput(node);
         })
      }
   }

   initRadioInputs(){
      const radioNodes = this.form.querySelectorAll('input:is([type="radio"]');
      for(const node of radioNodes) {
         node.addEventListener('change', () => {
            for(const node of radioNodes) {
               this.updateFormData();
               this.validateInput(node);
            }
         })
      }
   }

   initCheckboxInput(){
      const checkbox = this.form.querySelector('input:is([type="checkbox"]');
      checkbox.addEventListener('change', () => {
         this.updateFormData();
         this.validateInput(checkbox);
      })
   }

   initSubmit() {
      const submitButton = document.querySelector('.form__input-submit');

      submitButton.addEventListener('click', (e) => {
         e.preventDefault();
         this.updateFormData();
         this.validateAllInputs();
         
         const validInputs = this.allInputsValid();
         if(validInputs) {
            /* To clear animation-fill forwards */
            const alertContainer = document.querySelector('.alert__container');
            alertContainer.style.setProperty('animation', 'none');
            /************************************/

            this.resetInputs();
            window.scrollTo(0,0);

            /* Trigger animation upon submit */
            alertContainer.style.setProperty('display', 'block');
            alertContainer.style.setProperty('animation', 'alert 5s ease-in-out forwards');
            /************************************/
         }
      })
   }

   updateFormData() {
      this.formData = Object.fromEntries(new FormData(this.form));
   }

   allInputsValid() {
      const inputNodes = [...this.getAllInputNodes()];

      return inputNodes.filter(node => node.getAttribute('aria-invalid') === 'true').length === 0;
   }

   resetInputs() {
      const inputNodes = this.getAllInputNodes();
      
      for(const node of inputNodes) {
         const inputType = node.getAttribute('type') || node.tagName.toLowerCase();
         switch (inputType) {
            case 'text':
            case 'textarea':
            case 'email':
               node.value = '';

               break;
            case 'radio':
            case 'checkbox':
               node.checked = false;

               break;
            default:
               throw error('Invalid input', node);
         }
      }
   }

   getAllInputNodes() {
      return this.form.querySelectorAll('input, textarea');
   }

   validateAllInputs() {
      const inputNodes = this.getAllInputNodes();
      
      for(const node of inputNodes) {
         this.validateInput(node);
      }
   }

   validateInput(node) {
      const inputType = node.getAttribute('type') || node.tagName.toLowerCase();
      const inputNameAttr = node.getAttribute('name');

      node.setAttribute('aria-invalid','false');
      switch (inputType) {
         case 'text':
         case 'textarea':
            if(node.value === "") {
               node.setAttribute('aria-invalid','true');
            }

            break;
         case 'email':
            if(!node.checkValidity()) {
               node.setAttribute('aria-invalid','true');
            }
            
            break;
         case 'radio':
         case 'checkbox':
            if(!this.formData[inputNameAttr]){
               node.setAttribute('aria-invalid','true');
            }

            break;
         default:
            throw error('Invalid input', node);
      }
   }
}