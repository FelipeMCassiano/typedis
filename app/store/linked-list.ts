class Node<T> {
    value: T;
    prev: Node<T> | null;
    next: Node<T> | null;

    constructor(
        value: T,
        prev: Node<T> | null = null,
        next: Node<T> | null = null
    ) {
        this.value = value;
        this.next = next;
        this.prev = prev;
    }
}
export class LinkedList<T> {
    head: Node<T> | null;
    tail: Node<T> | null;
    length: number = 0;
    constructor() {
        this.head = this.tail = null;
    }
    append(value: T) {
        this.length++;

        if (!this.tail) {
            this.head = this.tail = new Node(value);
            return;
        }

        const oldTail = this.tail;
        this.tail = new Node(value);

        oldTail.next = this.tail;
        this.tail.prev = oldTail;
    }
    prepend(value: T) {
        this.length++;

        if (!this.head) {
            this.head = this.tail = new Node(value);
            return;
        }

        const oldHead = this.head;
        this.head = new Node(value);

        oldHead.prev = this.head;
        this.head.next = oldHead;
    }

    deleteHead(): T | null {
        if (!this.head) {
            return null;
        }

        const removedHead = this.head;
        this.length--;

        if (this.head === this.tail) {
            this.head = this.tail = null;
            return removedHead.value;
        }
        this.head = this.head.next;
        this.head!.prev = null;

        return removedHead.value;
    }
    deleteTail(): T | null {
        if (!this.tail) return null;

        const removedTail = this.tail;
        this.length--;

        if (this.head === this.tail) {
            this.head = this.tail = null;
            return removedTail.value;
        }

        this.tail = this.tail.prev;
        this.tail!.next = null;

        return removedTail.value;
    }
    search(value: T): Node<T> | null {
        let currentnode = this.head;
        while (currentnode) {
            if (currentnode.value === value) {
                return currentnode;
            }
            currentnode = currentnode.next;
        }
        return null;
    }
    walk(start: number, stop: number): T[] {
        const isCloseToHead = start < this.length / 2;
        return isCloseToHead
            ? this.walkFromHead(start, stop)
            : this.walkFromTail(start, stop);
    }

    private walkFromHead(start: number, stop: number): T[] {
        const values = [];
        let currentnode = this.head;
        let idx = 0;
        while (idx < start && currentnode) {
            currentnode = currentnode.next;
            idx++;
        }

        while (currentnode && idx <= stop) {
            values.push(currentnode.value);
            currentnode = currentnode.next;

            idx++;
        }

        return values;
    }
    private walkFromTail(start: number, stop: number): T[] {
        const values = [];
        let currentnode = this.tail;
        let idx = this.length - 1;
        while (idx > stop && currentnode) {
            currentnode = currentnode.prev;
            idx--;
        }
        while (currentnode && idx >= start) {
            values.push(currentnode.value);
            currentnode = currentnode.prev;
            idx--;
        }

        return values;
    }
}
