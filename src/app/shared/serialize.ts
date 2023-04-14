export interface PostDeserializePatchable {
  runPostDeserializePatch();
}


type TraverseCallback = (parent: any, key: string, x: any) => void;

export class JSONDeserializationHelper {
  public static traverseAndRunPostDeserializePatch(x: any) {
    console.log('runPostDeserializePatch inside traverseAndRunPostDeserializePatch', x);
    JSONDeserializationHelper.traverse(null, null, x, (parent, key, x) => {
      if (x && x.hasOwnProperty('runPostDeserializePatch') &&
        typeof x.runPostDeserializePatch === 'function') {
        console.log('running runPostDeserializePatch on object: ', x);
        x.runPostDeserializePatch();
      }
    });
  }

  public static traverseAndTypeCorrect(x: any) {
    console.log('runPostDeserializePatch inside traverseAndTypeCorrect', x);
    JSONDeserializationHelper.traverse(null, null, x, (parent, key, x) => {
      if (parent && key && x &&
        x.hasOwnProperty('getProperDeserializedTypeInstance') &&
        typeof x.runPostDeserializePatch === 'function') {
        console.log('running getProperDeserializedTypeInstance on object: ', x);
        const correctedTypeInstance = x.getProperDeserializedTypeInstance();
        parent[key] = Object.assign(correctedTypeInstance, x);
      }
    });
  }

  private static traverse(parent, key, x: any, callback: TraverseCallback) {
    if (this.isArray(x)) {
      this.traverseArray(x, callback);
    } else if ((typeof x === 'object') && (x !== null)) {
      this.traverseObject(x, callback);
    } else {
      callback(parent, key, x);
    }
  }

  private static traverseArray(arr, callback: TraverseCallback) {
    arr.forEach((x, idx) => {
      this.traverse(arr, idx, x, callback);
    });
  }

  private static traverseObject(obj, callback: TraverseCallback) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        this.traverse(obj, key, obj[key], callback);
      }
    }
  }

  // private isDate(o) {
  //   return (typeof o === 'object') && (o !== null) && Object.prototype.toString.call(o) === '[object Date]';
  //
  // }

  private static isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
  }
}


// export interface Serializable<PERSIST_TYPE> {
//   serialize(): PERSIST_TYPE;
//
// }
//
// export interface Deserializable<PERSIST_TYPE, R extends Deserializable<PERSIST_TYPE>> {
//   deserialize(pt: PERSIST_TYPE): R;
// }
//
//
// class JSONSerializationHelper {
//   static toInstance<T>(obj: T, json: string): T {
//     const jsonObj = JSON.parse(json);
//
//     if (typeof obj.deserialize === 'function') {
//       obj.deserialize(jsonObj);
//     }
//     else {
//       for (var propName in jsonObj) {
//         obj[propName] = jsonObj[propName];
//       }
//     }
//
//     return obj;
//   }
// }
