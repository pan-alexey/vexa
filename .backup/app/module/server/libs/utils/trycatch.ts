type OnError = (err: Error) => void
type OnErrorAsync = (err: Error) => Promise<void>

type OnSuccess<T> = (res: T) => void
type OnSuccessAsync<T> = (res: T) => Promise<void>

type OnErrorCallback = OnError|OnErrorAsync;

type OnSuccessCallback<T> = OnSuccess<T>|OnSuccessAsync<T>;

export function trycatch<Result>(fn: Promise<Result>, callback?: { onError?: OnErrorCallback, onSuccess: OnSuccessCallback<Result> }): Promise<{ result: Result | null; err: Error | null }> {
  return new Promise((resolve) => {
    const result: { result: Result | null; err: Error | null } = { result: null, err: null };

    fn.then((res) => {
      result.result = res as Result;
      if (callback?.onSuccess) {
        callback.onSuccess(result.result)
      };
      resolve(result);
    }).catch((err) => {
      result.err = err;
      if (callback?.onError) {
        callback.onError(err)
      };
      resolve(result);
    });
  });
}
