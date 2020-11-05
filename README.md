# MAITRE-D
> An opinionated and skilled local server

1. You have some local data. It's probably JSON. Maybe it's an array of entities which have an "id" field.
2. You have to spin up a local server to run as an API.
3. You don't want to remember how CORS works.
4. You wanna grab data from that JSON. Maybe you wanna grab it by that "id" field
5. You prefer Futures(?) as a way of modelling asynchrony with sanity. (?)

Use `maitre-d`. It's built on top of `express` and has the following features:

* Serve local data simply and configurably
  - default routes are:
    + `/`
    + `/:id`
* Load data on mount and configurably write it to a back-up on mount / unmount
