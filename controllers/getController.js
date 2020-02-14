/*
  handles all lookups from the request path and (eventually) parameters

  main problem: how to determine the requested resource and how can accesss be abstract enough
    to be store-agnostic?
    there are a few possible actions:
      - if 1 arg: non-nested collection in its entirety requested
      - if 2 args: specific item from non-nested collection requested
      - if 3 or more odd number args: nested collection in its entirety requested
      - if 3 or more even number args: specific item from nested collection requested

    examples (with args array):
      - ['users']
        users collection requested
      - ['users', '45']
        collection item with id = 45 from users collection requested
      - ['users', '45', 'comments']
        nested comments collection for users collection item with id = 45 requested
      - ['users', '45', 'comments', '2']
        specific item from nested comments collection with id = 2 for users collection
        item with id = 45 requested

    solution:
      - 

  TODO:
    - handle possible type conversion for args (e.g. item id's to integer)
    - determine 
*/

module.exports = function getController(apiName, args, next) {

}