


let count = 0
let color_count = 0
let colors = ["#03A9F4", "#00BCD4", "#009688","#4CAF50","#CDDC39","#f9ca24","#6ab04c"]


//------------------------DRAG 'N DROP!!!!---------------------------
	var dragObject = {}

	document.onmousedown = function(e) {

	  if (e.which != 1) { // если клик правой кнопкой мыши
	    return // то он не запускает перенос
	  }

	  var elem = e.target.closest('.draggable')

	  if (!elem) return // не нашли, клик вне draggable-объекта

	  // запомнить переносимый объект
	  dragObject.elem = elem

	  // запомнить координаты, с которых начат перенос объекта
	  dragObject.downX = e.pageX
	  dragObject.downY = e.pageY
	}

	document.onmousemove = function(e) {
	  if (!dragObject.elem) return // элемент не зажат

	  if ( !dragObject.avatar ) { // если перенос не начат...

	    // посчитать дистанцию, на которую переместился курсор мыши
	    var moveX = e.pageX - dragObject.downX
	    var moveY = e.pageY - dragObject.downY
	    if ( Math.abs(moveX) < 3 && Math.abs(moveY) < 3 ) {
	      return // ничего не делать, мышь не передвинулась достаточно далеко
	    }

	    dragObject.avatar = createAvatar(e) // захватить элемент
	    if (!dragObject.avatar) {
	      dragObject = {} // аватар создать не удалось, отмена переноса
	      return // возможно, нельзя захватить за эту часть элемента
	    }

	    // аватар создан успешно
	    // создать вспомогательные свойства shiftX/shiftY
	    var coords = getCoords(dragObject.avatar)
	    dragObject.shiftX = dragObject.downX - coords.left
	    dragObject.shiftY = dragObject.downY - coords.top

	    startDrag(e) // отобразить начало переноса

	    function createAvatar(e) {

		  // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
		  var avatar = dragObject.elem
		  var old = {
		    parent: avatar.parentNode,
		    nextSibling: avatar.nextSibling,
		    position: avatar.position || '',
		    left: avatar.left || '',
		    top: avatar.top || '',
		    zIndex: avatar.zIndex || ''
		  }

		  // функция для отмены переноса
		  avatar.rollback = function() {
		    old.parent.insertBefore(avatar, old.nextSibling)
		    avatar.style.position = old.position
		    avatar.style.left = old.left
		    avatar.style.top = old.top
		    avatar.style.zIndex = old.zIndex
		  }

		  return avatar
		}

		function startDrag(e) {
		  var avatar = dragObject.avatar
		  avatar.style.width = dragObject.elem.offsetWidth + 'px'
		  document.body.appendChild(avatar)
		  avatar.style.zIndex = 9999
		  avatar.style.position = 'absolute'
		}
	  }

	  // отобразить перенос объекта при каждом движении мыши
	  dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px'
	  dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px'

	  return false
	}



	document.onmouseup = function(e) {
	  // (1) обработать перенос, если он идет
	  if (dragObject.avatar) {
	    finishDrag(e)
	  }

	  // в конце mouseup перенос либо завершился, либо даже не начинался
	  // (2) в любом случае очистим "состояние переноса" dragObject
	  dragObject = {}

	 
		function finishDrag(e) {
		  var dropElem = findDroppable(e)

		  if (dropElem) {
		    	var avatar = dragObject.avatar
				avatar.style.position = 'relative'
				avatar.style.left = ""
				avatar.style.top = ""
				if(dropElem.length == 2)
		   		{
		   			dropElem[1].insertBefore(avatar,dropElem[0])
		   		}
		   		else
		   		{
		   			dropElem[0].appendChild(avatar)
		   		}
		  } else {
		    	alert('bad')
		  }
		}
		
		// возвратит ближайший droppable или null
		// это предварительный вариант findDroppable, исправлен ниже!
		function findDroppable(event) {
		  // спрячем переносимый элемент
		  dragObject.avatar.hidden = true;

		  // получить самый вложенный элемент под курсором мыши
		  var elem = document.elementFromPoint(event.clientX, event.clientY);

		  // показать переносимый элемент обратно
		  dragObject.avatar.hidden = false;

			if (elem == null) {
			// такое возможно, если курсор мыши "вылетел" за границу окна
			return null;
			}
			if(elem.closest('.module') == null)
			{
				return [elem.closest('.droppable')]
			}
			else
			{
				return [elem.closest('.module'), elem.closest('.droppable')] 
			}
		}
	}
	function getCoords(elem) { // кроме IE8-
	  var box = elem.getBoundingClientRect()

	  return {
	    top: box.top + pageYOffset,
	    left: box.left + pageXOffset
	  }

	}

//-------------------------------------------------------------------------------------

	getColour = _=>{
		let result = colors[color_count] 
		color_count ++
		if(color_count>6)color_count=0
		return result

	}
	


function Category(name , order){
	this.name = name
	this.name_elem = document.createElement('p')
	this.name_elem.innerHTML = this.name


	this.wrp = document.createElement('div')
	this.wrp.classList.add('category_wrp')

	this.element = document.createElement('div')
	this.element.classList.add('category')
	this.element.classList.add('droppable')
	this.element.setAttribute('name',this.name)

	this.panel = document.createElement('div')
	this.panel.classList.add("panel")

	this.make_module = document.createElement('button')
	this.make_module.classList.add('make_module')
	this.make_module.innerHTML = '+'

	this.panel.appendChild(this.name_elem)
	this.panel.appendChild(this.make_module)
	

	this.wrp.appendChild(this.panel)
	this.wrp.appendChild(this.element)

	


	this.order = order
	this.modules = []
	this.background = ''
}

function Module(order,name){
	this.name = name
	this.element = document.createElement('div')
	this.element.innerHTML = this.name
	this.element.classList.add('module')
	this.element.classList.add('draggable')
	this.element.setAttribute('name',this.name)
	this.order = order
}

function sortInOrder(target, elements){
 
	for (var j = 0; j < elements.length - 1; j++) {
		let min = elements[j].order
		let cont_el = elements[j]
		for (var i = j; i < elements.length ;i++) {

			if(min>elements[i].order){
				cont_el = elements[i]
				min = elements[i].order
			}
		}
		elements[j] = cont_el
	}
	for (var y = 0; y < elements.length; y++) {
		target.appendChild(elements[i])
	}
}

window.onload = _ => {
	let workspace = document.getElementById('workspace')
	let name_category = document.getElementById('name_category')
	let make_category = document.getElementById('make_category')
	let categories = []
	let submit = document.getElementById('submit')
	let new_category = document.getElementById('new_category')

	let flag_make_cat = true
	new_category.onclick = _ =>{
		if(flag_make_cat){
			document.getElementById('name_and_make').classList.add('active')
			flag_make_cat = false
		}
		else{
			document.getElementById('name_and_make').classList.remove('active')
			flag_make_cat = true
		}
	}

	make_category.onclick = _ =>{
		let name = name_category.value
		categories.push(new Category(name,count))
		//categories[count].element.style.background = getColour()
		workspace.appendChild(categories[count].wrp)
		console.log(name)
		let i = 0, count_catch = count
		categories[count].make_module.onclick = (e) =>{
			document.getElementById('module_form').classList.add('active')
			document.getElementById('apply').onclick = _ =>{
				if(i<4){
					let m_name = document.getElementById('select_name').value
					categories[count_catch].modules.push(new Module(i,m_name))
					categories[count_catch].modules[i].element.style.background = getColour()
					console.log(categories[count_catch].modules[i])
					categories[count_catch].element.appendChild(categories[count_catch].modules[i++].element)
				
				}
				else{
					return null
				}
				document.getElementById('module_form').classList.remove('active')
			}

		}

		count++

	}

	submit.onclick = _ =>{
		let arr = []

		for (var j = 0; j < categories.length ; j++){
			let modules = categories[j].element.childNodes
			arr.push({name: categories[j].name, modules: []})
			for (var i = 0; i < categories[j].modules.length ; i++){
				
				arr[j].modules.push({name: modules[i].getAttribute('name')})
			}
		}
		arr = JSON.stringify(arr)
		console.log(arr)
	}



	
}