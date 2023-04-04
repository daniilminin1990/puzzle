/*
Определить кого будем таскать. Это puzzle, каждый
*/
const puzzles = document.querySelectorAll('.puzzle'),
      cells = document.querySelectorAll('.cell'),
      puzzlesGroup = document.querySelector('.puzzles'),
      wholePic = document.querySelector('.whole_pic'),
      puzzledBack = document.querySelector('.puzzled_background'),
      content = document.querySelector('.content')      
let puzzleThis
let count = 100
let mouseX, mouseY
// Активируем draggable для puzzles
// puzzles.draggable = true;
// Хотя для рисунков он по умолчанию есть

// Устанавливаем ID для cell
cells.forEach((cell, cellId) => {
    cell.setAttribute('data-id', cellId)
})

puzzles.forEach(function(puzzle, puzzleId)  {
    puzzle.setAttribute('data-id', puzzleId);
    puzzle.addEventListener('dragstart', function(elem) {
        setTimeout( function() {
            puzzle.classList.add('active')
        }, 1)
        puzzleThis = this
        puzzle.style.zIndex = count + 1;
        mouseX = elem.offsetX
        mouseY = elem.offsetY

    })
    
    puzzle.addEventListener('drag', (elem) => {
        puzzleThis.style.top = elem.pageY - mouseY + 'px';
        puzzleThis.style.left = elem.pageX - mouseX + 'px';
    })
    
    puzzle.addEventListener('dragend', (elem) => {
        // puzzle.style.transform = 'translate()'elem.pageY - mouseY + 'px';
        // puzzleThis.removeAttribute('transform');
        puzzle.classList.remove('active')

    });
    
    
    content.addEventListener('dragenter', () => {

    })
    content.addEventListener('dragleave', () => {
        
    })
    content.addEventListener('dragover', (elem) => {
        elem.preventDefault()
    })
    content.addEventListener('drop', () => {
        
    })

    cells.forEach(cell => {
        
        cell.addEventListener('dragenter', () => {
        })
        
        cell.addEventListener('dragover', (elem) => {
            elem.preventDefault()
        })
        
        cell.addEventListener('dragleave', () => {
        })
        
        cell.addEventListener('drop', () => {
            if(puzzleThis.dataset.id == cell.dataset.id){
                cell.append(puzzleThis)
                puzzleThis.style.left = '0';
                puzzleThis.style.top = '0';
                // setTimeout(() => {
                // }, 100)



                if(puzzlesGroup.children.length == 0) {
                    setTimeout( () => {
                        wholePic.classList.add('active');
                        puzzle.classList.add('disappear');
                        puzzledBack.classList.add('hide');
                    }, 200)
                };
            }
        })
    })
})
// Почему перемещается по top и left не также как translate??
// Почему я не могу присвоить top и left 0px


// if (puzzlesGroup == null){

// }

/*
Нужно допилить расположение пазлов в произвольном месте

Реализовать появление полного рисунка после окончания сборки
А как? это наступит в тот момент, когда не останется паззлов в puzzles (if puzzles count = 0)
Тогда присвоить whole_pic z-index = 9999
И присвоить cells z-index = -999;



*/

/*
Ответы на вопросы по Puzzles.
Сделал разметку HTML, подложку под пазлы - ячейки, чтобы можно было туда вставлять элементы
Много элементов было с абсолютным позиционированием, а это вызывало проблему контекста наложения - stacking context, которая обусловлена присвоением определенного порядка позиционирования элементов в зависимости от того, к какому порядку приурочен элемент.
То есть если есть контейнер, внутри него ячейки и блок, внутри блока пазлы.
    Контейнер
        ячейки
        блок
            пазлы
    Если применить абсолютное позиционирвоание ячейкам и пазлам, то как бы я ни старался, пазлы поверх ячеек я не смогу поставить - из-за контекста наложения.
    Поэтому либо убирать абсолютное позиционирование, либо играть с отображением ячеек - убирать их из потока.

Вопрос
    Почему у меня не вставлялись пазлы в ячейки
Ответ -
    Потому что я перетаскивал в ячейку ВСЕ пазлы. Переменная с qurySelectorAll, то есть это массив
    А массив в ячейку не засунуть, я не определял конкретный пазл в конкретную ячейку.
    А чтобы брался один только пазл, тогда нужно внутрь цикла forEach для ячейки (dragstart -- dragend) вставить forEach для ячеек И внури forEach для пазла определить переменную THIS для конкретно этой ячейки, например puzzleThis = this. 
    Использовать puzzleThis нужно в cell drop в момент присоединения HTML элемента puzzle к cell. Т.е. 
        cell.append(puzzleThis) 
    И помним, что this со стрелочными не работает, значит нам нужно будет написать function(puzzleThis)
    This - это текущий элемент, на котором произошло событие. 

    Также нужно убрать translate у puzzle, который переместили и вставить этот код нужно в drop у cell, когда заканчиваем перетаскивать puzzle и будем вставлять его в cell.
        puzzle.style.transform = 'translate(0)'

        Позже я отказался от translate и сделал это с помощью top и left. Так что этот код я не записал

    Теперь нужно осуществить вставку puzzle в cell с таким же идентификатором. У меня были созданы классы num_1, 2 и т.д., но проще сделать через data-id, поэтому нужно и cell и puzzle дать свой dataid
        cells.forEach((cell, cellId) => {
          cell.setAttribute('data-id', cellId)
        })
    А для puzzle в уже созданном цикле forEach написать такой же код
        puzzles.forEach(function(puzzle, puzzleId)  {
            puzzle.setAttribute('data-id', puzzleId);
        ...
    В function две переменных - одна для puzzle или cell, одной штуки, а вторая - для id, потому что мы оперируем обеими внутри этой функции

    Теперь можем сделать проверку одинаковости ID у puzzle и cell и вставку конкретно этого puzzle в конкретно этот cell.
        cell.addEventListener('drop', () => {
            if(puzzleThis.dataset.id == cell.dataset.id){
                cell.append(puzzleThis)
        Также тут же убираем top и left, у того же puzzleThis
                puzzleThis.style.left = '0';
                puzzleThis.style.top = '0';
        Вот теперь все на своих местах

Замечание - можно было бы у cells убрать абсолютное позиционирование и сделать относительнок
position relative и убрать top, left. Можно попробовать. 
А НЕЛЬЗЯ, потому что в противном случае они будут распологаться каскадом. Прикол абсолютного позиционирования в том, что ячейки могут наезжать друг на друга. Поэтому от этого не избавиться.

*/
