import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export class Store<T> {
  state$: Observable<T>;
  private store$: BehaviorSubject<T>;
  private initialState: T;

  constructor(initialState: T, private storageKey?: string) {
    this.initialState = this.storageKey ? this.getFromStorage(initialState, this.storageKey) : initialState;
    this.store$ = new BehaviorSubject<T>(this.initialState);
    this.state$ = this.store$.asObservable();
  }

  /**
   * Get the static value of the store's state.
   * @returns The static value of the store.
   */
  getState(): T {
    return this.store$.getValue();
  }

  /**
   * Get the static value of a specific object inside the store's state.
   * @param key A string representing a key in the state object.
   */
  getStateOf<K extends keyof T>(key: K): T[K] {
    return this.getState()[key];
  }

  /**
   * Update the state of the store by passing a partial static object.
   * @param state A partial object containing updates for the state.
   */
  setState(state: Partial<T>): void {
    // Use Object.assign to overcome an issue of typescript with the spread operator on generic types
    this.store$.next(Object.assign({}, this.getState(), state));
    this.save();
  }

  /**
   * Get the observable representation of an object in the state.
   * @param key A string representing a key in the state object.
   */
  select<K extends keyof T>(key: K): Observable<T[K]> {
    return this.state$.pipe(
      map((state) => state[key] as T[K]),
      distinctUntilChanged()
    );
  }

  /**
   * Resets this store by resetting the initial state.
   */
  reset(): void {
    this.store$.next(this.initialState);
    this.clear();
  }

  /**
   * Get the previously saved state in the session storage.
   * @param initialState The initial state for the store
   * @param key The storage key for the session storage
   */
  private getFromStorage(initialState: T, key: string): T {
    const value = sessionStorage.getItem(key);

    return value ? JSON.parse(value) : initialState;
  }

  /**
   * Save the current state in the session storage.
   */
  private save(): void {
    if (this.storageKey) {
      const state = this.getState();
      sessionStorage.setItem(this.storageKey, JSON.stringify(state));
    }
  }

  /**
   * Clears the current session storage.
   */
  private clear(): void {
    if (!!this.storageKey) {
      sessionStorage.removeItem(this.storageKey);
    }
  }
}
