type AlmostValidateError := {
    type: ValidateErrorType, message: String
}
type PossibleValidateError = Array<AlmostValidateError> |
    AlmostValidateError | String | null

type Validator := (value: Any, key: String, parent: Object) =>
    PossibleValidateError
type ValidateErrorType := "creditCard" | "email" | "length" |
  "match" | "max" | "memberOf" | "min" | "range" | "truthy" | "type"
type ValidateError := {
  attribute: String,
  message: String,
  type: ValidateErrorType,
  value: Any
}

validate-form := (Object<String, Array<Validator>>) =>
    Array<ValidationError> | null

validate-form/add-error := (errors: Array<ValidationError>, key: String,
    maybeError: PossibleValidateError) => Array<ValidationError>
