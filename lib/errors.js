/*
  error messages and printf-like behavior to inject dynamic
  content to supply useful error messages in the response body
*/

module.exports = (function errorMessages() {
  const errors = {
    NO_API: 'no API subdomain specified.',
    API_NOT_FOUND: "API with the name '{{name}}' does not exist.",
    NO_PATH: 'no path specified',
    WRONG_CONTENT_TYPE: 'Please specify your POST/PUT requests with a Content-Type of application/json (you used {{type}}).',
    NO_OR_WRONG_ACCEPT: 'You need to allow JSON response bodies with the Accept request header.',
    TOO_MANY_NESTED_RESOURCES: 'A maximum number of four nested resources is allowed.',
    RESOURCE_NAME_TOO_LONG: 'Resource names must not be longer than 64 characters.',
    WRONG_RESOURCE_NAME: 'A resource name can only contain alphanumeric characters, hyphens and underscores and must start with a letter.',
    WRONG_RESOURCE_ID: 'A resource item id can only contain numeric characters.',
    NO_OR_WRONG_POST_BODY: 'no POST body sent or could not be parsed.',
    NO_OR_WRONG_PUT_BODY: 'no PUT body sent or could not be parsed.',
    POST_TO_RESOURCE_ITEM: 'cannot POST to individual resource item.',
    DELETE_ON_COLLECTION: 'cannot DELETE whole collections, only specific items',
    TOO_MANY_REQUESTS: 'You have sent too many request in a short time. Slow down.',
    ITEM_NOT_FOUND: 'No data found for {{requested_item}}.',
    POST_UNSUCCESSFUL: 'Data could not be inserted.',
    PUT_UNSUCCESSFUL: "Data could not be updated (most likely because the item doesn't exist).",
    DELETE_UNSUCCESSFUL: "Data could not be deleted (because it likely isn't there).",
  };

  return (messageKey, ...replacers) => {
    if (!errors[messageKey]) return 'Unspecified error';

    let message = errors[messageKey];
    let index = 0;
    message = message.replace((/{{(.*)}}/g), () => {
      const replacement = replacers[index];
      index += 1;
      return replacement;
    });
    return message;
  };
}());
