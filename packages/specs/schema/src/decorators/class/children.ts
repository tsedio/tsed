import {Store, Type} from "@tsed/core";
import {JsonEntityFn} from "../common/jsonEntityFn.js";

/**
 * Declares child controller classes for route composition and hierarchy.
 *
 * The `@Children()` decorator establishes parent-child relationships between controllers,
 * allowing you to compose complex routing hierarchies and organize related endpoints into
 * logical groups. Child controllers inherit the parent's base path.
 *
 * ### Basic Usage
 *
 * ```typescript
 * @Controller("/users")
 * @Children(UserProfileController, UserSettingsController)
 * class UserController {
 *   @Get("/")
 *   list() {
 *     // GET /users/
 *   }
 * }
 *
 * @Controller("/profile")
 * class UserProfileController {
 *   @Get("/")
 *   getProfile() {
 *     // GET /users/profile/
 *   }
 * }
 *
 * @Controller("/settings")
 * class UserSettingsController {
 *   @Get("/")
 *   getSettings() {
 *     // GET /users/settings/
 *   }
 * }
 * ```
 *
 * ### Multi-Level Hierarchy
 *
 * ```typescript
 * @Controller("/api")
 * @Children(UsersController, ProductsController)
 * class ApiController {}
 *
 * @Controller("/users")
 * @Children(UserProfileController, UserOrdersController)
 * class UsersController {}
 *
 * @Controller("/profile")
 * class UserProfileController {
 *   @Get("/")
 *   get() {
 *     // GET /api/users/profile/
 *   }
 * }
 * ```
 *
 * ### Resource Organization
 *
 * ```typescript
 * @Controller("/admin")
 * @Children(
 *   AdminUsersController,
 *   AdminProductsController,
 *   AdminReportsController
 * )
 * class AdminController {
 *   // Parent controller for all admin routes
 * }
 * ```
 *
 * ### Use Cases
 *
 * - **Route Organization**: Group related endpoints logically
 * - **API Versioning**: Organize versions with child controllers
 * - **Module Structure**: Mirror application module hierarchy in routes
 * - **Access Control**: Apply middleware at parent level for all children
 * - **Documentation**: Generate organized OpenAPI specs with grouped endpoints
 *
 * ### Benefits
 *
 * - **Maintainability**: Keep related routes together
 * - **Scalability**: Easy to add new endpoint groups
 * - **Clarity**: Clear route hierarchy in codebase
 * - **Reusability**: Share middleware and configuration across children
 *
 * ### Important Notes
 *
 * - Children automatically inherit parent's base path
 * - Parent-child relationship is stored in metadata
 * - Useful for generating structured API documentation
 * - Middleware on parent applies to all children
 *
 * @param children - Controller classes to register as children
 *
 * @decorator
 * @public
 */
export function Children(...children: Type<any>[]): ClassDecorator {
  return JsonEntityFn((store) => {
    store.store.set("childrenControllers", children);

    children.forEach((childToken) => {
      Store.from(childToken).set("parentController", store.token);
    });
  });
}
