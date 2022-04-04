let isMount = true;
let fiber = null
let workinprogress = null;

export function useState(initState) {
    let hook;
    /**
     * 当是Mount时，生成hook链表
     * 当update时，取出hook链表
     */
    if (isMount) {
        hook = {
            memoState: initState,
            next: null,
            queue: {
                pendding: null
            }
        }
        if (!fiber.memoState) {
            fiber.memoState = hook
        } else {
            workinprogress.next = hook
        }
        workinprogress = hook
    } else {
        hook = workinprogress
        workinprogress = workinprogress.next
    }
    /**
     * 获取基础的state
     */
    let baseState = hook.memoState;
    // 当队列中存在queue需要处理时
    if (hook.queue.pendding !== null) {
        // 取出第一个action
        let firstUpdate = hook.queue.pendding.next;
        do {
            const action = firstUpdate.action;
            baseState = typeof action === 'function' ? action(baseState) : action
            firstUpdate = firstUpdate.next
        } while (firstUpdate !== hook.queue.pendding.next)
    }
    return [baseState, dispatch.bind(null, hook.queue)]
}

function dispatch(queue, action) {
    // debugger
    const update = {
        action,
        next: null
    }

    if (queue.pendding === null) {
        update.next = update
    } else {
        update.next = queue.pendding.next
        queue.pendding.next = update
    }
    queue.pendding = update

    schedule()
}

function schedule() {
    isMount = false;
    workinprogress = fiber.memoState;
    render(fiber.stateNode, fiber.dom)
}

export function render(fc, dom) {
    if (!fiber) {
        fiber = {
            memoState: null,
            stateNode: fc,
            dom
        }
    }
    removeChild(dom)

    fc().forEach(element => {
        dom.append(element)
    });
}

export function createElement(value, event) {
    const element = document.createElement("button")
    element.textContent = value;
    element.addEventListener('click', event)
    return element
}

function removeChild(dom) {
    while (dom.firstElementChild) {
        dom.removeChild(dom.firstElementChild)
    }
}