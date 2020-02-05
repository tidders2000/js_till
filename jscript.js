//Data controller

var dataController = (function() {

    var menuItem = function(id, item, price, icon) {
        this.id = id;
        this.item = item;
        this.price = price;
        this.icon = icon;
    };

    var data = {

        menu: [],
        totals: 0,
        order: [],
        itemArray:[]
    }
    // dummy items for the array instead of live database 
    return {
        additem: function() {
            //set up variables
            var coffee, tea, cookie, cake, candy;
            // set up objects
            coffee = new menuItem(0, 'Coffee', 0.99, 'fas fa-coffee');
            tea = new menuItem(1, 'Tea', 0.99, 'fas fa-mug-hot');
            cookie = new menuItem(2, 'Cookie', 1.99, 'fas fa-cookie');
            cake = new menuItem(3, 'Cake', 2.10, 'fas fa-birthday-cake');
            candy = new menuItem(3, 'Candy', 0.50, 'fas fa-candy-cane');
            


            // add to menu
            data.menu.push(coffee, tea, cookie, cake, candy);
            
        },
        
        findItem: function(item) {
          
      
            data.menu.forEach(function(current) {
                 
                 
                 if (current.item === item) {
                 
                   data.itemArray.push(current);
                }
               
                
            });
            
             return(data.itemArray);
        },
        // function for testing data array 
        testing: function() {

            console.log(data);
        },
        menuButtons: function(){
            
            return(data.menu);
            
        },
    };

})();


// UI Controller

var UIController = (function() {

    var DOMStrings = {
        prod_hol: ".product__holder",
        products: ".products",
        pid:".pid",
    }
    
   

    return {

        getItem: function(e) {
            return {
                item: e.target.innerHTML
            }
        },

        getDOMStrings: function() {
            return (DOMStrings)
        },

        addMenu: function(data) {
            var html, newHtml;

           
            //for each loop
             data.forEach(function(current) {

             

                //place holders to html

                html = '<div class="col-sm-2 products" id ="id-%id%"><i class="%icon%">%item%</i></div>';

                // change placeholders for data

                newHtml = html.replace('%id%', current.id);
                newHtml = newHtml.replace('%item%', current.item);
                newHtml = newHtml.replace('%icon%', current.icon);

                //render to screen

                document.querySelector(DOMStrings.prod_hol).insertAdjacentHTML('beforeEnd', newHtml);
            });
        }

    };
})();

//App Controller


var controller = (function(UICtrl, DatCtrl) {


    var setUpEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();
     
        document.querySelector(DOM.prod_hol).addEventListener('click', updateTill);

    };

    var updateTill = function(event) {
        var itemSelected, itemToDisplay;
        //get item selected from array
        itemSelected= (event.target.textContent);
        
        itemToDisplay= dataController.findItem(itemSelected);
        
        console.log(itemToDisplay);
        
      
        //1. get input selection id
        //var item = UICtrl.getItem(event);

        //2. find input selection from array
      


        //3. render buttons
        
         
        //4. update totals



    };

    return {
        init: function() {

            console.log('App has started');
            var menuButts = dataController.menuButtons();//get menu data
            setUpEventListeners();//listen for buttons
            dataController.additem(); // set up dummy data
            UICtrl.addMenu(menuButts);// add buttons to menu
        }
    };



})(UIController, dataController);

controller.init()
