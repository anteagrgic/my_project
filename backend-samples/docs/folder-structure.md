# Project folder structure

Project folder structure is as follows:

```bash
├── dist                                        # Destination application files
├── extras                                      # Helper files, such as CSVs for loading the data, ...
├── logs                                        # Log files
├── node_modules                                # Packages (modules)
├── src                                         # Source code files
    ├── common                                  # Other, domain-unrelated stuff (database configuration, ...)
    └── modules                                 # Domain-related modules
        ├── <module-name>
            ├── dto                                 # Module-related DTOs
                ├── <dto-name>.dto.ts               # - Body data DTOs
                ├── <param-name>.params.ts          # - Path parameter DTOs
                └── <query-name>.query.ts           # - Query parameter DTOs

            ├── entities                            # Module-related entities
                └── <entity-name>.entity.ts

            ├── interface                           # Module-related interfaces
                └── <interface-name>.interface.ts

            ├── service                             # Module-related services (business logic)
                └── <service-name>.service.ts

            ├── tests                               # Module-related tests
            └── <module-name>.module.ts             # Module file

    ├── app.module.ts                           # Main module (Where all other modules are initialized)
    ├── app.service.ts                          # Health check service
    └── app.controller.ts                       # Health check controller

├── test                                        # Test files
└── ...                                         # Other project configuration (package.json, Dockerfile, ...)
```
