import express, { NextFunction, Request, Response, Router } from "express"

export type Handler = (req: Request, res: Response, next?: NextFunction) => void

type Handlers = {
  index?: Handler
  show?: Handler
  create?: Handler
  update?: Handler
  deleteFn?: Handler
  extendRouter?: (router: Router) => void
}

/** Returns an Express Router with CRUD routes
 **/
export function createRoutes(handlers: Handlers): Router {
  let router = express.Router()

  if (handlers.index) router.get("", handlers.index)
  if (handlers.show) router.get("/:id", handlers.show)
  if (handlers.create) router.post("", handlers.create)
  if (handlers.update) router.put("/:id", handlers.update)
  if (handlers.deleteFn) router.delete("/:id", handlers.deleteFn)

  if (handlers.extendRouter) handlers.extendRouter(router)

  return router
}

export function authenticateBearerToken(
  validateTokenFn: (token: string, res: Response) => void
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bearerToken = req.headers.authorization?.split(" ")[1]

      if (bearerToken) {
        validateTokenFn(bearerToken, res)
      } else {
        res.status(401).send()
      }

      next()
    } catch (e) {
      res.status(500).send()
    }
  }
}
