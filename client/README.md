
---
# FEATURE: CLIENTS PAGE
**version:** 1.01

### GLOBAL
- Created auth guard

### clients.module
- Created
- Imported clients-routing.module
- Created a resolver to get client data
- Added clients route to app-rounting module
- Added auth guard
- Added clients resolver

### clients.component
- Created
- Styled

### client-card.component
- Created
- Styled
- Responsive design
- Added edit, expand_more and expand_less icons
- Added animations

### client-headers.component
- Created
- Styled
- Added add icon
- Added sort icon

### pagination.component
- Created
- Added paginate functionallity
- Added sort functionallity
- Added first_page, last_page icons
- Added navigate_next and navigate_before icons

### pagination.service
- Created
- Added sort functionallity

### client-form.component
- Created
- Styled
- Added Error handling
- Added submit functionallity

### token-interceptor
- Created
- Added functionallity to add firebase token to each request

### users.service
- Added update functionallity
- Modified it to make it work with the interceptor

---
# INITIAL COMMIT
**version:** 1.00

### GLOBAL
- Configured docker for development
- Created gitignore
- Added global styles
- Added firebase library
- Added bootstrap library

### Configured angular.json
- stylePreprocessorOptions to import glogal settings
- Added bootstrap-grid.scss as a global style

### app.module
- Created
- Imported app-routing.module
- Imported shared module
- Created an http-interceptor to add firebase token to every request

### app.component
- Created
- Bootstrapped

### auth.component
- Created
- Added basic styles
- Instantiated inside app.component
- Added basic style
- Responsive design
- Configured Firebase

### shared.module
- Created
- Imported it in app module

### login-button.component
- Created
- Added basic style
- Instantiated inside auth.component
- Responsive design