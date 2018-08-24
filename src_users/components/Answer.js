import React from "react";
import uuid from "uuid-v4";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Field, SubmissionError, reduxForm } from "redux-form";
import { PageHeader, Form } from "react-bootstrap";
import { answerQuestion, fetchAnswers } from "../actions/questions";
import FormField from "./common/FormField";
import FormSubmit from "./common/FormSubmit";

export class AnswerQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addFormVisible: false,
      addFormValue: ""
    };

    this.formSubmit = this.formSubmit.bind(this);
  }

  componentWillMount() {
    this.props.fetchAnswers();
  }

  render() {
    const {
      user,
      answers,
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
          <PageHeader>Answer Form</PageHeader>
          <h3>Instructions</h3>
          <p>Use this page to answer questions</p>
          <Form horizontal onSubmit={handleSubmit(this.formSubmit)}>
            <Field component={FormField} name="answer" label="Answer" />
            <FormSubmit
              error={error}
              invalid={invalid}
              submitting={submitting}
              buttonSaveLoading="Saving..."
              buttonSave="Submit Answer"
            />
          </Form>
        </div>

        <div>
          <PageHeader>Submitted Answers</PageHeader>
          {answers.toList().map((answer, idx) => (
            <h5 key={answer + idx}>
              {idx + 1}: {answer}
            </h5>
          ))}
        </div>
      </div>
    );
  }

  // submit the form
  formSubmit(values) {
    const { answerQuestion, auth } = this.props;
    event.preventDefault();
    answerQuestion(values);
    this.setState({ addFormValue: "" });
  }
}

// decorate the form component
const AnswerQuestionForm = reduxForm({
  form: "answer_question",
  validate: function(values) {
    const errors = {};
    if (!values.answer) {
      errors.answer = "answer is required";
    }
    return errors;
  }
})(AnswerQuestion);

const mapStateToProps = (state, ownProps) => {
  return {
    answers: state.answers
  };
};

export default connect(
  mapStateToProps,
  { answerQuestion, fetchAnswers }
)(AnswerQuestionForm);
