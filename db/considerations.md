# Database Considerations and Problems for "200 OK"

## Challenge

The main question is how to properly store data that is dynamic (i.e. it does not need to follow a pre-defined schema) yet still relational, comprising nested one-to-many relationships (similar to a tree structure).

## Specific Problem

RESTful API design encourages nested resources, allowing the relation between parent and child resources to be made very clear. This will result in API request routes like

```
/users/42/images/23/comments/5/votes/2/
```

For user with `id = 42`, her image with `id = 23`, that image's comments with `id = 5` and that comment's vote with `id = 2`, all id's counting up for only the specific subresource.

In a sense, this request route maps perfectly to a nested JSON object: 

```json
{
  users: [
    ...,
    {
      id: 42,
      ...,
      images: [
        ...,
        {
          id: 23,
          ...,
          comments: [
            ...,
            {
              id: 5,
              ...,
              votes: [
                ...,
                {
                  id: 2,
                  ...
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

However, JSON itself seems like a bad storage format. Updating a single entry that is deeply nested will require loading the whole JSON structure and walking through its nested properties to retrieve, update or delete it. If only a child element is considered in an operation, the parent properties should ideally not be required to be parsed, loaded or otherwise processed.  
Finding a data store that fits this dynamic model will be one of the main challenges for **200 OK**.

## SQL vs. NoSQL

### The SQL Way

Each of the one-to-many relationships will be represented with foreign key columns: The `images` table has a column `userId` that reference the primary `id` key from `users`. `comments` then has an `imageId` foreign key column and so on and so forth. The problem lies in the primary key used for each resource: The final `id` for the specific vote in the example refers to an `id` unique to a single comment of a single image of a single user. Simply collecting all votes into a single table would work only when introducing keys for the current and each preceding resource: for a vote with `id = 2`, that would be `voteId = 2`, `commentId = 5`, `imageId = 23` and `userId = 42`. Those columns combined could form the primary key and to add a unique constraint to the table.  
This all needs to be stored in a table specific to votes nested within comments within images within users, because there might be other votes nested inside of other resources that bear no relationship to those votes.

Considering the amount of dynamic table creation necessary and the significant overhead stored in each table (in the example four different `id` columns with one json column for the actual data). I'm not sure how performant running those queries will be, but judging from the small bit of experience I have, filtering all entities of one resource (e.g. `users/42/images/23/comments/5`) would not run as quickly as it should. Together with the clunkiness of having many tables and the difficulty of deleting unneccessary data when an entity from an upper-level resource gets deleted, using SQL does not seeem like an attractive solution.

### The Document Store Way (a.k.a. MongoDB)

Generally speaking, a document store like _MongoDB_ runs into the same problems as an SQL solution. Even nesting documents inside of each other (_embedded documents_) to achieve JSON structure parity comes with all the caveats of a pure JSON solution (essentially retrieving all parent data even when a deeply nested child is requested). This might only be considered a viable option when the limits for resource items are set relatively low (so that the resulting data structure has a sane size).  

Separate collections require the same amount of unique identifiers like an SQL solution with no added benefits except for the simpler database API because _MongoDB_ can be used completely schema-less.

## Possible Approaches and Solutions

### Materialized Paths

At the most extreme, every `users` item along with all child resources can live inside a single collection or table, provided that there is a unique identifier to identify the ancestry of those items. This could be achieved with a _materialized path_ field:

```
{ id: 2, path: 'users42,images23,comments5', <other item data> } // represents the vote with id = 2 from the example
```

Here, `id` itself is not a unique identifier, only when paired with the `path` field. The `path` field can also be used as a selector with pattern matching/regular expressions, providing easy access to even the most nested resources.

### Graph Database

to be evaluated ....