import React from "react";
import uuid from "uuid-v4";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Field, SubmissionError, reduxForm } from "redux-form";
import { PageHeader, Form } from "react-bootstrap";
import { askQuestion, fetchQuestions } from "../actions/questions";
import FormField from "./common/FormField";
import FormSubmit from "./common/FormSubmit";

export class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addFormVisible: false,
      addFormValue: ""
    };

    this.formSubmit = this.formSubmit.bind(this);
  }

  componentWillMount() {
    this.props.fetchQuestions();
  }

  render() {
    const {
      user,
      questions,
      handleSubmit,
      error,
      invalid,
      submitting
    } = this.props;
    return (
      <div
        className="page-user-edit"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
          flexWrap: "wrap"
        }}
      >
        <div>
          <PageHeader>Question Form</PageHeader>
          <h3>Instructions</h3>
          <p>Use this page to ask questions</p>
          <Form horizontal onSubmit={handleSubmit(this.formSubmit)}>
            <Field component={FormField} name="question" label="Question" />
            <FormSubmit
              error={error}
              invalid={invalid}
              submitting={submitting}
              buttonSaveLoading="Submitting..."
              buttonSave="Submit Answer"
            />
          </Form>
        </div>

        <div>
          <PageHeader>Questions</PageHeader>
          {questions.toList().map((question, idx) => (
            <h5 key={question + idx}>
              {idx + 1}: {question}
            </h5>
          ))}
        </div>
      </div>
    );
  }

  // submit the form
  formSubmit(values) {
    const { askQuestion } = this.props;
    event.preventDefault();
    askQuestion(values);
    this.setState({ addFormValue: "" });
  }
}

// decorate the form component
const AskQuestionForm = reduxForm({
  form: "ask_question",
  validate: function(values) {
    const errors = {};
    if (!values.answer) {
      errors.answer = "question is required";
    }
    return errors;
  }
})(Questions);

const mapStateToProps = (state, ownProps) => {
  return {
    questions: state.questions
  };
};

export default connect(
  mapStateToProps,
  { askQuestion, fetchQuestions }
)(AskQuestionForm);
