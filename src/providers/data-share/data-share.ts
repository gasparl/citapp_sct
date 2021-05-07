import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

@Injectable()
export class DataShareProvider {
  stored_images: any = {};

  constructor(public storage: Storage) { }
