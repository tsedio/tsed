export const HTTP_STATUS_MESSAGES = {
  "100": {label: "Continue", code: "CONTINUE"},
  "101": {label: "Switching Protocols", code: "SWITCHING_PROTOCOLS"},
  "102": {label: "Processing", code: "PROCESSING"},
  "103": {label: "Early Hints", code: "EARLY_HINTS"},
  "200": {label: "Success", code: "SUCCESS"},
  "201": {label: "Created", code: "CREATED"},
  "202": {label: "Accepted", code: "ACCEPTED"},
  "203": {
    label: "Non-Authoritative Information",
    code: "NON_AUTHORITATIVE_INFORMATION"
  },
  "204": {label: "No Content", code: "NO_CONTENT"},
  "205": {label: "Reset Content", code: "RESET_CONTENT"},
  "206": {label: "Partial Content", code: "PARTIAL_CONTENT"},
  "207": {label: "Multi-Status", code: "MULTI_STATUS"},
  "208": {label: "Already Reported", code: "ALREADY_REPORTED"},
  "226": {label: "IM Used", code: "IM_USED"},
  "300": {label: "Multiple Choices", code: "MULTIPLE_CHOICES"},
  "301": {label: "Moved Permanently", code: "MOVED_PERMANENTLY"},
  "302": {label: "Found", code: "FOUND"},
  "303": {label: "See Other", code: "SEE_OTHER"},
  "304": {label: "Not Modified", code: "NOT_MODIFIED"},
  "305": {label: "Use Proxy", code: "USE_PROXY"},
  "306": {label: "(Unused)", code: "UNUSED"},
  "307": {label: "Temporary Redirect", code: "TEMPORARY_REDIRECT"},
  "308": {label: "Permanent Redirect", code: "PERMANENT_REDIRECT"},
  "310": {label: "Too Many Redirects", code: "TOO_MANY_REDIRECTS"},
  "400": {label: "Bad Request", code: "BAD_REQUEST"},
  "401": {label: "Unauthorized", code: "UNAUTHORIZED"},
  "402": {label: "Payment Required", code: "PAYMENT_REQUIRED"},
  "403": {label: "Forbidden", code: "FORBIDDEN"},
  "404": {label: "Not Found", code: "NOT_FOUND"},
  "405": {label: "Method Not Allowed", code: "METHOD_NOT_ALLOWED"},
  "406": {label: "Not Acceptable", code: "NOT_ACCEPTABLE"},
  "407": {
    label: "Proxy Authentication Required",
    code: "PROXY_AUTHENTICATION_REQUIRED"
  },
  "408": {label: "Request Timeout", code: "REQUEST_TIMEOUT"},
  "409": {label: "Conflict", code: "CONFLICT"},
  "410": {label: "Gone", code: "GONE"},
  "411": {label: "Length Required", code: "LENGTH_REQUIRED"},
  "412": {label: "Precondition Failed", code: "PRECONDITION_FAILED"},
  "413": {
    label: "Request Entity Too Large",
    code: "REQUEST_ENTITY_TOO_LARGE"
  },
  "414": {label: "Request URI Too Long", code: "REQUEST_URI_TOO_LONG"},
  "415": {label: "Unsupported Media Type", code: "UNSUPPORTED_MEDIA_TYPE"},
  "416": {
    label: "Request Range Unsatisfiable",
    code: "REQUEST_RANGE_UNSATISFIABLE"
  },
  "417": {label: "Expectation Failed", code: "EXPECTATION_FAILED"},
  "418": {label: "I'm a Teapot", code: "I_M_A_TEAPOT"},
  "421": {label: "Misdirected Request", code: "MISDIRECTED_REQUEST"},
  "422": {label: "Unprocessable Entity", code: "UNPROCESSABLE_ENTITY"},
  "423": {label: "Locked", code: "LOCKED"},
  "424": {label: "Failed Dependency", code: "FAILED_DEPENDENCY"},
  "425": {label: "Too Early", code: "TOO_EARLY"},
  "426": {label: "Upgrade Required", code: "UPGRADE_REQUIRED"},
  "427": {label: "Unassigned", code: "UNASSIGNED"},
  "428": {label: "Precondition Required", code: "PRECONDITION_REQUIRED"},
  "429": {label: "Too Many Requests", code: "TOO_MANY_REQUESTS"},
  "430": {label: "Unassigned", code: "UNASSIGNED"},
  "431": {
    label: "Request Header Fields Too Large",
    code: "REQUEST_HEADER_FIELDS_TOO_LARGE"
  },
  "451": {
    label: "Unavailable For Legal Reasons",
    code: "UNAVAILABLE_FOR_LEGAL_REASONS"
  },
  "500": {label: "Internal Server Error", code: "INTERNAL_SERVER_ERROR"},
  "501": {label: "Not Implemented", code: "NOT_IMPLEMENTED"},
  "502": {label: "Bad Gateway", code: "BAD_GATEWAY"},
  "503": {label: "Service Unavailable", code: "SERVICE_UNAVAILABLE"},
  "504": {label: "Gateway Timeout", code: "GATEWAY_TIMEOUT"},
  "505": {
    label: "HTTP Version Not Supported",
    code: "HTTP_VERSION_NOT_SUPPORTED"
  },
  "506": {label: "Variant Also Negotiates", code: "VARIANT_ALSO_NEGOTIATES"},
  "507": {label: "Insufficient Storage", code: "INSUFFICIENT_STORAGE"},
  "508": {label: "Loop Detected", code: "LOOP_DETECTED"},
  "509": {
    label: "Bandwidth Limit Exceeded",
    code: "BANDWIDTH_LIMIT_EXCEEDED"
  },
  "510": {label: "Not Extended", code: "NOT_EXTENDED"},
  "511": {
    label: "Network Authentication Required",
    code: "NETWORK_AUTHENTICATION_REQUIRED"
  }
};

export function getStatusConstant(status: number | string) {
  return (HTTP_STATUS_MESSAGES as any)[status]?.code;
}

export function getStatusMessage(status: number | string) {
  return (HTTP_STATUS_MESSAGES as any)[status]?.label;
}
