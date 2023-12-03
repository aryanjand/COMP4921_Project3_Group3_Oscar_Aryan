import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export const authInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  req = req.clone({
    withCredentials: true,
    headers: req.headers.set('ngrok-skip-browser-warning', 'true'),
  });
  return next(req).pipe(
    tap({
      error: () => {
        window.location.href = '/signin';
      },
    }),
  );
};
