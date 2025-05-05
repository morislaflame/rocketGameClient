// src/store/AnimationStore.ts
import { makeAutoObservable } from "mobx";

export type AnimationsCache = { [url: string]: Record<string, unknown> };

export default class AnimationStore {
  private _animations: AnimationsCache = {};
  
  constructor() {
    makeAutoObservable(this);
  }
  
  hasAnimation(url: string): boolean {
    return !!this._animations[url];
  }
  
  getAnimation(url: string): Record<string, unknown> | undefined {
    return this._animations[url];
  }
  
  setAnimation(url: string, data: Record<string, unknown>): void {
    this._animations[url] = data;
  }
  
  get animations(): AnimationsCache {
    return this._animations;
  }
}