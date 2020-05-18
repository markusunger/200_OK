/*
  error messages and printf-like behavior to inject dynamic
  content to supply useful error messages in the response body
*/

module.exports = (function errorMessages() {
  const errors = {
    NO_API: 'No API subdomain specified.',
    API_NOT_FOUND: "An API with the name '{{name}}' does not exist.",
    NO_PATH: 'No path specified, access to root path of the API is not allowed.',
    WRONG_CONTENT_TYPE: 'Please specify your POST/PUT requests with a Content-Type of application/json (you used {{type}}).',
    NO_OR_WRONG_ACCEPT: 'You need to allow JSON response bodies with the Accept request header.',
    NO_PREDEFINED_METHOD: 'You did not specify custom behavior for the provided HTTP method ({{method}}).',
    TOO_MANY_NESTED_RESOURCES: 'A maximum number of four nested resources is allowed.',
    RESOURCE_NAME_TOO_LONG: 'Resource names must not be longer than 64 characters.',
    WRONG_RESOURCE_NAME: 'A resource name can only contain alphanumeric characters, hyphens and underscores and must start with a letter.',
    WRONG_RESOURCE_ID: 'A resource item id can only contain numeric characters.',
    NO_OR_WRONG_POST_BODY: 'You did not send a POST body or that body could not be parsed.',
    NO_OR_WRONG_PUT_BODY: 'You did not send a PUT body or that body could not be parsed.',
    POST_TO_RESOURCE_ITEM: 'You cannot send a POST request to an individual resource item (use PUT instead if you want to update that item).',
    DELETE_ON_COLLECTION: 'You cannot DELETE whole collections, only specific items.',
    NO_VALID_PARENT: '{{request}} cannot be accessed, because the parent item {{parentItem}} does not exist.',
    TOO_MANY_REQUESTS: 'You have sent too many request in a short time. Slow down.',
    ITEM_NOT_FOUND: 'No data found for {{requested_item}}.',
    POST_UNSUCCESSFUL: 'Data could not be inserted.',
    PUT_UNSUCCESSFUL: "Data could not be updated (most likely because the item doesn't exist).",
    DELETE_UNSUCCESSFUL: "Data could not be deleted (because it likely isn't there).",
  };

  return (messageKey, replacers) => {
    if (!errors[messageKey]) return 'Internal Server Error, please try again later.';

    let message = errors[messageKey];
    let index = 0;
    message = message.replace((/{{(.*?)}}/g), () => {
      const replacement = replacers[index];
      index += 1;
      return replacement;
    });
    return message;
  };
}());
