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
    }

    var setUpData = function() {

        var coffee, tea, cookie, cake, candy, hotfood;
        // set up objects
        coffee = new menuItem(0, 'Coffee', 0.99, 'fas fa-coffee');
        tea = new menuItem(1, 'Tea', 0.99, 'fas fa-mug-hot');
        cookie = new menuItem(2, 'Cookie', 1.99, 'fas fa-cookie');
        cake = new menuItem(3, 'Cake', 2.49, 'fas fa-birthday-cake');
        candy = new menuItem(3, 'Candy', 0.58, 'fas fa-candy-cane');
        hotfood = new menuItem(3, 'Hot Food', 2.99, 'fas fa-concierge-bell');

        // add to menu
        data.menu.push(coffee, tea, cookie, cake, candy, hotfood);

    };


    // dummy items for the array instead of live database 
    return {
        additem: function() {

            return (setUpData())


        },
        // update totals array
        updateTotals: function() {
            data.totals = 0
            data.order.forEach(function(current) {

                data.totals += parseFloat(current.price, 10);


            });
            return (data.totals);

        },

        //delete item from display
        
        deleteItem: function(id) {
            id = parseInt(id,10);
            var ids, index;
            
            ids = data.order.map(function(current) {
                return current.id;
            });
                 console.log(ids);
                 
            index = ids.indexOf(id, 0);
               console.log(id);
               console.log(index);
            if (index !== -1) {
                data.order.splice(index, 1);
                  
              }
              //update totals
              console.log(data.order);
              dataController.updateTotals();

                return(data.totals);
        },

        //reset totals and display for next transaction
        resetTotals: function() {

            data.totals = 0;
            data.order = [];

        },
        //find selected item in menu array 
        findItem: function(item) {
            var currentItem;

            data.menu.forEach(function(current) {


                if (current.item === item) {
                    currentItem = current
                    data.order.push(current);
                }


            });

            return (currentItem);
        },
        // function for testing data array 
        testing: function() {

            console.log(data);
        },
        menuButtons: function() {

            return (data.menu);

        },
    };

})();


// UI Controller

var UIController = (function() {
    //class names for listeners
    var DOMStrings = {
        prod_hol: ".product__holder",
        products: ".products",
        pid: ".pid",
        display: ".display",
        total: ".total",
        reset: ".btn__co",
        displayRow: '.display__row',
        del: '.delete'
    };


    var formatNumber = function(num) {

        var newNum = num.toFixed(2);
        return (newNum);

    };

    return {
        // get product title from clicked button
        getItem: function(e) {
            return {
                item: e.target.innerHTML
            };
        },

        getDOMStrings: function() {
            return (DOMStrings)
        },
        // adds selected products to item display

        addDisplay: function(data) {
            var oldHTML, repHTML;

            //place holders to html  
            oldHTML = '<tr class="display__row"><td>%item%</td><td>1</td><td>£%price%</td><td><i class=" delete fas fa-window-close" id="%id%"></i></td></tr>';
            // change placeholders for data
            repHTML = oldHTML.replace('%item%', data.item);
            repHTML = repHTML.replace('%price%', data.price);
            repHTML = repHTML.replace('%id%', data.id);
            //render to screen
            document.querySelector(DOMStrings.display).insertAdjacentHTML('afterEnd', repHTML);

        },
        // adds product display total to DOM        
        addTotals: function(a) {


            document.querySelector(DOMStrings.total).textContent = '£' + formatNumber(a);
        },
        // remove deleted line from order and render new totals

        removeSingleLine: function(target) {
            var el
            // remove chosen line
                el=(target.parentNode.parentNode);
            // update totals
               el.parentNode.removeChild(el);



        },
        resetDisplay: function() {
            var x;

            //reset totals
            document.querySelector(DOMStrings.total).textContent = "£0.00";
            //reset display
            var element = document.getElementsByTagName('td'),
                index;


            for (index = element.length - 1; index >= 0; index--) {
                element[index].parentNode.removeChild(element[index]);
            }

        },

        // add menu buttons 
        addMenu: function(data) {
            var html, newHtml;


            //for each loop
            data.forEach(function(current) {

                //place holders to html

                html = '<div class="col-sm-2 products" id ="id-%id%"><i class="%icon%"></i><br>%item%</div>';

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
        document.querySelector(DOM.reset).addEventListener('click', clearTill);
        document.querySelector('.list__container').addEventListener('click', deleteLine);


    };

    var updateTill = function(event) {

        //1. get item selected from array


        var itemToDisplay = dataController.findItem(event.target.textContent);




        //2. add item to display

        UICtrl.addDisplay(itemToDisplay);

        //3.Update Totals

        var total_display = DatCtrl.updateTotals();

        //3. render totals

        UICtrl.addTotals(total_display);
        //4. update totals



    };

    var clearTill = function(event) {

        //reset display and totals

        DatCtrl.resetTotals();

        // render display and totals

        UICtrl.resetDisplay();

    };

    var deleteLine = function(event) {
        var itemID, new_total;
        //find element to remove
        
        itemID = event.target.id
        
        
        // remove from order array
        
        new_total= DatCtrl.deleteItem(itemID);
        
        
        // update totals
        UICtrl.addTotals(new_total);
        
        // remove from display
        
        UICtrl.removeSingleLine(event.target);

    };

    return {
        init: function() {

            console.log('App has started');
            var menuButts = dataController.menuButtons(); //get menu data
            setUpEventListeners(); //listen for buttons
            DatCtrl.additem(); // set up dummy data

            UICtrl.addMenu(menuButts); // add buttons to menu
        }
    };



})(UIController, dataController);

controller.init()
