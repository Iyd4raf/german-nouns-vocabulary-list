//****************************************************************************************************************************************
//----------------------------------------------------------------------------------------------------------------------------------------
//MODEL
//----------------------------------------------------------------------------------------------------------------------------------------
//****************************************************************************************************************************************
const vocabController = (() => {
  
    //-----------NOUN CLASS---------------
    
	class Noun {
        constructor (id, engNoun, gerNoun, gerPlural) {
            this.id = id;
            this.engNoun = engNoun;
            this.gerNoun = gerNoun;
            this.gerPlural = gerPlural;
        }
    };
  
    //----------DATA STRUCTURE----------
  
	const _data = {   
        nouns: []    //nouns stored as array of objects
    };
    
    
    //----------STORE DATA STRUCTURE IN LOCAL STORAGE----------
    
    const _persistData = () => {
        localStorage.setItem('Nouns', JSON.stringify(_data.nouns));
    };
    
    //----------GET DATA FROM LOCAL STORAGE----------
    
    const readStorage = () => {
        const storage = JSON.parse(localStorage.getItem('Nouns'));
        if (storage) _data.nouns = storage;
        return [..._data.nouns];       //return copy of data structure so that it can't be manipulated outside of this module
    };
    
    
    //----------ADD NOUN----------
    
    const addNoun = (engNoun, gerNoun, gerPlural) => {
      let newNoun, ID;
      
      //create new ID
      if (_data.nouns.length > 0) {
          ID = _data.nouns[_data.nouns.length - 1].id + 1;   
      } else {
          ID = 0;
      }
      
      newNoun = new Noun(ID, engNoun, gerNoun, gerPlural);   //create new noun object
      _data.nouns.push(newNoun);        //add it to data structure
      _persistData();            //store _data.nouns object in local storage
      seeData();        //console log data structure
      
      return newNoun;      //return new item
    };
    
    
    
    //----------DELETE NOUN----------
    
    const deleteNoun = ID => {
      const index = _getIndex(ID);     //get index of noun object to delete
      
      if (index !== -1) {
          _data.nouns.splice(index, 1);      //remove noun object from data structure
      }
      
      _persistData();     //store _data.nouns object in local storage
      seeData();        //console log data structure
    };
    
    
    //----------UPDATE NOUN----------
    
    const updateNoun = (ID, engNoun, gerNoun, gerPlural) => {
        let index, noun;

        index = _getIndex(ID);   //get index of noun object to update

        if (index !== -1) {
            noun = _data.nouns[index];     //get noun object to update
            //update values
            noun.engNoun = engNoun;
            noun.gerNoun = gerNoun;
            noun.gerPlural = gerPlural;

            _persistData();     //store _data.nouns object in local storage

            seeData();        //console log data structure

            return noun;   //return noun object
        }
    };
    
    
    //----------GET INDEX OF NOUN TO DELETE OR UPDATE----------
    
    const _getIndex = (ID) => {
        let index, ids;

        ids = _data.nouns.map(function(noun) {    //get all ids
          return noun.id;
        });

        index = ids.indexOf(ID);     //get index of noun object to delete or update
        return index;
    };
    
    //----------CONSOLE LOG DATA STRUCTURE----------
    
    const seeData = () => {
        console.log(_data);
    };
    
    
    //----------RETURN PUBLIC FUNCTIONS----------
    
    return {
        readStorage,
        addNoun,
        deleteNoun,
        updateNoun,
        seeData
    };
  
})();








//****************************************************************************************************************************************
//----------------------------------------------------------------------------------------------------------------------------------------
//VIEW
//----------------------------------------------------------------------------------------------------------------------------------------
//****************************************************************************************************************************************
var UIController = (() => {
  
  
  //----------DOM STRINGS----------
  
  const _DOMStrings = {
      btnAdd: '.btn__add',
      btnUpdate: '.btn__update',
      btnCancel: '.btn__cancel',
      btnClear: '.btn__clear',
      inputEng: '.input__eng',
      inputGer: '.input__ger',
      inputPlural: '.input__plural',
      headingsRow: '.headings__row',
      vocabRow: '.vocab__row',
      errMsgEng: '.err__msg__eng',
      errMsgGer: '.err__msg__ger',
      errMsgPlural: '.err__msg__plural'
  };
  
  
  //----------GETTING----------
  
  
  const getDOMStrings = () => ({..._DOMStrings});  
  //use spread operator to return copy of DOMStrings object. Otherwise DOMStrings obj can be manipulated outside of this module because object passed by reference.


  
  const getInput = () => {
      return {
          engNoun: document.querySelector(_DOMStrings.inputEng).value,
          gerNoun: document.querySelector(_DOMStrings.inputGer).value,
          gerPlural: document.querySelector(_DOMStrings.inputPlural).value
      };
  };
  
  const getInputFields = () => {
      return {
          eng: document.querySelector(_DOMStrings.inputEng),
          ger: document.querySelector(_DOMStrings.inputGer),
          plural: document.querySelector(_DOMStrings.inputPlural)
      };
  };
  
  const getErrMsgEls = () => {
      return {
          eng: document.querySelector(_DOMStrings.errMsgEng),
          ger: document.querySelector(_DOMStrings.errMsgGer),
          plural: document.querySelector(_DOMStrings.errMsgPlural)
      };
  };

  
  
  
  //----------ADD ITEM----------
  
  const addItem = noun => {
      let html;
      const element = document.querySelector(_DOMStrings.vocabRow);  //element to add html to
      const pluralSplitter = `&nbsp;(pl.)&nbsp;`;  //seperate german noun and its plural

      //create html string with placeholder text
      html = `
          <div class="col-lg-5 item py-1" data-id="${noun.id}">
            <div class="d-flex">
              <div class="delete__div"><span><i class="far fa-times-circle delete" id="delete__${noun.id}"></i></span></div>
              <div class="update__div"><span><i class="fas fa-pen update" id="update__${noun.id}"></i></span></div>
              <div class="eng__text__div"><span class="eng__text" id="eng__text__${noun.id}">${noun.engNoun}</span></div>
              <div class="ml-auto ger__text__div"><span class="ger__text" id="ger__text__${noun.id}">${noun.gerNoun}</span><span class="plural__splitter" id="plural__splitter__${noun.id}"><!--pluralSplitter--></span><span class="plu__text" id="plu__text__${noun.id}">${noun.gerPlural}</span></div>
            </div>
          </div>
          <div class="col-lg-1" data-id="${noun.id}"></div>
      `;
      //spans in divs with delete__div & update__div classes restrict deletion/updating of item only to clicking delete/update icons. See DOM traverse in _deleteItemOrLoadValuesInForm function.

      if (noun.gerPlural) html = html.replace('<!--pluralSplitter-->', pluralSplitter);     //if gerPlural then add plural splitter

      element.insertAdjacentHTML('beforeend', html);        //insert html into dom
  };
  
  
  //----------DELETE ITEM----------
  
  const deleteItem = selectorID => {
      const divs = document.querySelectorAll(`div[data-id='${selectorID}']`);    //gets div.col-lg-5 and div.col-lg-1
      for (let div of divs) {
          div.parentNode.removeChild(div);
      }
  };
  
  
  
  //----------LOAD VALUES IN FORM FOR UPDATING----------
  
  const loadValuesInForm = nounID => {
      const [engTextID, gerTextID, pluTextID] = [`eng__text__${nounID}`, `ger__text__${nounID}`, `plu__text__${nounID}`];
      const [engTextEl, gerTextEl, pluTextEl] = [document.getElementById(engTextID), document.getElementById(gerTextID),  document.getElementById(pluTextID)];

      const inputFields = getInputFields();
      inputFields.eng.value = engTextEl.textContent;
      inputFields.ger.value = gerTextEl.textContent;
      inputFields.plural.value = pluTextEl.textContent;
      window.scrollTo(0, 0);      //scroll to top of page
  };
  
  
  
  //----------UPDATE ITEM----------
  
  
  const updateItem = noun => {
      if (noun.id >= 0) {
          const engTextEl = document.getElementById(`eng__text__${noun.id}`);
          const gerTextEl = document.getElementById(`ger__text__${noun.id}`);
          const pluTextEl = document.getElementById(`plu__text__${noun.id}`);
          const pluralSplitterEl = document.getElementById(`plural__splitter__${noun.id}`);
          const pluralSplitter = `&nbsp;(pl.)&nbsp;`;

          engTextEl.textContent = noun.engNoun;
          gerTextEl.textContent = noun.gerNoun;
          pluTextEl.textContent = noun.gerPlural;

          if (noun.gerPlural) {         //if there is an german plural
              pluralSplitterEl.innerHTML = pluralSplitter;           //add plural splitter
          } else {
              pluralSplitterEl.innerHTML = `<!--pluralSplitter-->`;   //else do not add plural splitter
          }
      }
  };
  
  
 
  
  
  //-----------CANCEL UPDATE-----------

  const cancelUpdate = () => {
          clear();    //clear input fields and error signs      
          showBtnAdd(true);        //show add button & hide update & cancel buttons
          setNounIDAttr('blank');      //set data-nounid attribute of update button to '';
  };
  
  
  
  //-----------GET & SET UPDATE BUTTON DATA-NOUNID ATTRIBUTE-----------
  
  
  //get noun id from data-nounid attribute stored in update button
  const getIDFromBtnUpdate = () => {
      const btnUpdate = document.querySelector(_DOMStrings.btnUpdate);
      return btnUpdate.dataset.nounid;
  };
  
  
  //store noun id in data-nounid attribute of update button or set it to blank
  const setNounIDAttr = nounID => {
      const btnUpdate = document.querySelector(_DOMStrings.btnUpdate);
      if (nounID === 'blank') {
          btnUpdate.dataset.nounid = '';
      } else {
          btnUpdate.dataset.nounid = nounID;
      }
  };
  
  
  //-----------FORM VALIDATION-----------
  
  
  const emptyFieldEngCheck = (fieldEng, errMsgEng) => {
      if (fieldEng.value === '') {
          fieldEng.classList.add('border__red');
          errMsgEng.textContent = 'Enter English noun';
          return true;
      }
      return false;
  };
  
  
  const validateInput = (input, inputFields, errMsgEls) => {
      const msgEng = 'English letters only';
      const msgGer = 'German characters only'; 
      const regEng = /[^a-z\s\-]/i;      //allow a-z case insensitive, space & dash
      const regGer = /[^a-z\s\-\u00e4\u00f6\u00fc\u00df]/i;   //allow äöüß characters in addition to what is in regEng
    
      const isValidEng = _validate(input.engNoun, inputFields.eng, errMsgEls.eng, msgEng, regEng);
      const isValidGer = _validate(input.gerNoun, inputFields.ger, errMsgEls.ger, msgGer, regGer);
      const isValidGerPlural = _validate(input.gerPlural, inputFields.plural, errMsgEls.plural, msgGer, regGer);
     
      const valid = isValidEng && isValidGer && isValidGerPlural; 
      
      return valid;
  };
  
  
  const _validate = (inputString, field, errMsgEl, msg, reg) => {
      const invalid = reg.test(inputString);      //test input against regular expression

      if (!invalid) {      
          return true;
      } else {
          errMsgEl.textContent = msg;
          field.classList.add('border__red');
          return false;
      }
  };
  
  
  
  
  
  
  //-----------CLEAR INPUT FIELDS AND ERROR SIGNS-----------
  
  const clear = () => {
    clearFields();
    clearErrorSigns();
  }
  
  
  //-----------CLEAR FIELDS-----------
  
  
  const clearFields = () => {
      const inputFields = getInputFields();
      inputFields.eng.value = '';
      inputFields.ger.value = '';
      inputFields.plural.value = '';
  };
  
  
  
  //-----------CLEAR ERROR SIGNS-----------
  
  const clearErrorSigns = () => {
      const inputFields = getInputFields();
      const errMsgEls = getErrMsgEls();
      for (const el in inputFields) {
          inputFields[el].classList.remove('border__red');    //remove red border from input field
      }
      for (const el in errMsgEls) {
          errMsgEls[el].textContent = '';      //set error message text to blank
      }
  };
  
  
  
  //-----------SHOW / HIDE INPUT BUTTONS-----------
  
  const showBtnAdd = isHidden => {
      //get button elements
      const btnAdd = document.querySelector(_DOMStrings.btnAdd);
      const btnUpdate = document.querySelector(_DOMStrings.btnUpdate);
      const btnCancel = document.querySelector(_DOMStrings.btnCancel);

      if (isHidden) {  //if add button hidden then show it and hide update & cancel buttons
          btnUpdate.classList.add('hide');
          btnCancel.classList.add('hide');
          btnAdd.classList.remove('hide');
      } else {      //else show update & cancel buttons and hide add button
          btnAdd.classList.add('hide');
          btnUpdate.classList.remove('hide');
          btnCancel.classList.remove('hide');
      }
  };
    
  
  
  
   //-----------LOAD HEADINGS & RESIZE EVENT THROTTLE-----------
  

  let _resizeTimer;  // Set resizeTimer to empty so it resets on page load
  
  //throttle resize event so it doesn't fire at a high rate
  const resizeThrottle = () => {
      // On resize, run the function and reset the timeout
      clearTimeout(_resizeTimer);
      _resizeTimer = setTimeout(_loadHeadings, 100);
  };   
  
  
  const _loadHeadings = () => {
    
      //console.log("resized");

      let html;
      const element = document.querySelector(_DOMStrings.headingsRow);  

      if (window.innerWidth >= 992) {
          html = `
            <div class="col-lg-5 item my-1">
              <div class="float-left"><strong>English</strong></div>
              <div class="float-right"><strong>German</strong></div>
            </div>
            <div class="col-lg-1"></div>
            <div class="col-lg-5 d-flex item my-1">
              <div><strong>English</strong></div>
              <div class="ml-auto"><strong>German</strong></div>
            </div>
            <div class="col-lg-1"></div>
          `;

          element.innerHTML = html;
      } else {
          html = `
            <div class="col-lg-3 item my-1">
              <div class="float-left"><strong>English</strong></div>
              <div class="float-right"><strong>German</strong></div>
            </div>
          `;

          element.innerHTML = html;
      }
    
  };
  
  
  //-----------RETURN PUBLIC FUNCTIONS & VARIABLES-----------
  
  return {
    getDOMStrings,
    getInput,
    getInputFields,
    getErrMsgEls,
    addItem,
    deleteItem,
    loadValuesInForm,
    updateItem,
    cancelUpdate,
    getIDFromBtnUpdate,
    setNounIDAttr,
    validateInput,
    emptyFieldEngCheck,
    clear,
    clearErrorSigns,
    clearFields,
    showBtnAdd,
    resizeThrottle
  };
  
})();







//****************************************************************************************************************************************
//----------------------------------------------------------------------------------------------------------------------------------------
//CONTROLLER
//----------------------------------------------------------------------------------------------------------------------------------------
//****************************************************************************************************************************************
var controller = ((vocabCtrl, UICtrl) => {
	   
  
  
  //----------ctrl ADD ITEM----------
 
  const _ctrlAddItem = () => {
      let input, inputFields, errMsgEls, isEmptyField, isValid, newNoun;

      //get input & elements
      input = UICtrl.getInput();
      inputFields = UICtrl.getInputFields();
      errMsgEls = UICtrl.getErrMsgEls();

      UICtrl.clearErrorSigns();      //clear error signs

      isEmptyField = UICtrl.emptyFieldEngCheck(inputFields.eng, errMsgEls.eng);  //is English noun input field empty?

      if (!isEmptyField) {       //if no empty field
          isValid = UICtrl.validateInput(input, inputFields, errMsgEls);  //is input valid?

          if (isValid) {
              newNoun = vocabCtrl.addNoun(input.engNoun, input.gerNoun, input.gerPlural);   //add noun to data structure
              UICtrl.addItem(newNoun);     //add item to UI
              UICtrl.clearFields();        //clear input fields
          } else {
              return;       //invalid input
          }

      } else {
          return;      //English noun input field is empty
      }
    
  };
  
  
  //----------ctrl DELETE ITEM----------
  
  const _ctrlDeleteItem = nounID => {
      vocabCtrl.deleteNoun(nounID);    //delete the noun from the data structure
      UICtrl.deleteItem(nounID);   //delete the item from the UI
    
      UICtrl.clear();    //clear input fields and error signs
      //following lines of code are here in case user clicked update icon before deleting an item
      UICtrl.showBtnAdd(true);           //show add button & hide update & cancel buttons
      UICtrl.setNounIDAttr('blank');     //set data-nounid attribute of update button to ''
  };
  
  
  //----------ctrl UPDATE ITEM----------
  
  const _ctrlUpdateItem = () => {
      let input, inputFields, errMsgEls, isEmptyField, isValid, noun, nounID;

      //get input & elements
      input = UICtrl.getInput();
      inputFields = UICtrl.getInputFields();
      errMsgEls = UICtrl.getErrMsgEls();

      UICtrl.clearErrorSigns(inputFields, errMsgEls);   //clear error signs

      isEmptyField = UICtrl.emptyFieldEngCheck(inputFields.eng, errMsgEls.eng);    //is English noun input field empty?

      if (!isEmptyField) { 
          isValid = UICtrl.validateInput(input, inputFields, errMsgEls);       //is input valid?

          if (isValid) {
            nounID = UICtrl.getIDFromBtnUpdate();      //get noun id from data-nounid attribute of update button

            if (nounID) {
              nounID = parseInt(nounID);   //convert nounID to integer
              //update the noun in the data structure and get updated noun object
              noun = vocabCtrl.updateNoun(nounID, input.engNoun, input.gerNoun, input.gerPlural);

              UICtrl.updateItem(noun);    //update the item in the UI

              UICtrl.clearFields();          //clear input fields
              UICtrl.showBtnAdd(true);       //show add button & hide update & cancel buttons
              UICtrl.setNounIDAttr('blank');   //set data-nounid attribute of update button to ''
            }
          } else {
              return;    //not valid
          }

      } else {
          return;   //English noun input field is empty
      }

  };
  
  
  //----------DETERMINE IF DELETE ICON OR UPDATE ICON CLICKED & THUS CALL CTRL DELETE ITEM FUNCTION OR LOAD VALUES IN FORM FOR UPDATING----------
  
  //This function determines which icon was clicked & therefore whether to delete or update the item. It is needed because we cannot attach event listeners to the icons directly as they are not in the dom when page loads which means we have to use event delegation.
  const _deleteItemOrLoadValuesInForm = event => {
      let nounID, iconClicked;
    
      nounID = event.target.parentNode.parentNode.parentNode.parentNode.dataset.id;   //get id of noun from data-id attribute in div.item element. nounID is string.

      iconClicked = event.target.className;        //get the icon clicked - either delete icon or update icon

      if (nounID) {
          nounID = parseInt(nounID);   //convert nounID to integer
          if (iconClicked.includes('update')) {
              UICtrl.loadValuesInForm(nounID);    //load values in form for updating

              UICtrl.clearErrorSigns();
              UICtrl.showBtnAdd(false);       //hide add button & show update & cancel buttons
              UICtrl.setNounIDAttr(nounID);   //store noun id in data-nounid attribute of update button
          } else if (iconClicked.includes('delete')) {
               const message = 'Are you sure you want to delete this item?';
               const confirmed = confirm(message);           //display confirm box
               if (confirmed) {
                   _ctrlDeleteItem(nounID);
               } else {
                   return;
               }
          }
      }
    
  };
  

  //----------RESTORE VOCABULARY ON PAGE LOAD----------

  const _restoreVocab = () => {
      const nouns = vocabCtrl.readStorage();  //restore vocab and get it

      //render existing vocab
      nouns.forEach(function(noun) {
        UICtrl.addItem(noun);
      });
  };

  
  //----------SETUP EVENT LISTENERS----------

  const _setupEventListeners = () => {
      const _DOM = UICtrl.getDOMStrings(); //get dom strings from UI controller

      document.querySelector(_DOM.btnAdd).addEventListener('click', _ctrlAddItem);
      document.querySelector(_DOM.vocabRow).addEventListener('click', _deleteItemOrLoadValuesInForm);
      document.querySelector(_DOM.btnUpdate).addEventListener('click', _ctrlUpdateItem);
      document.querySelector(_DOM.btnCancel).addEventListener('click', UICtrl.cancelUpdate);
      document.querySelector(_DOM.btnClear).addEventListener('click', UICtrl.clear);
      window.addEventListener('load', UICtrl.resizeThrottle);
      window.addEventListener('resize', UICtrl.resizeThrottle);
      window.addEventListener('load', _restoreVocab);
  };
  
  
  //----------INITIALISATION FUNCTION----------
  
  const init = function() {
      console.log('Application has started.');
      _setupEventListeners();
  };
  
  
  //----------RETURN PUBLIC FUNCTIONS----------
  
  return {
    init
  };
	
	
})(vocabController, UIController);





controller.init();








