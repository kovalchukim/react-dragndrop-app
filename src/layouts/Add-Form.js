import React, { Component } from 'react'
import { Form, Field } from 'react-final-form'
import { cities } from '../config'
import { uploadImage, sendForm } from '../services/form.service'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import Styles from '../Styles'
import ReactDropzone from 'react-dropzone'
import ErrorValidation from '../components/errorValidation';

class AddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
          cities: [],
          preview: {},
          isLoading: false,
          imageArr: [],
          city: null,
          title: ''
        }
    }

    componentDidMount() {
        this.setState({cities});
    }

    onDrop = (images, values) => {
        this.setState({isLoading: true, ...values});
        let imageArr = [...this.state.imageArr],
            count = 0;

        images.forEach(file => {
            uploadImage(file)
                .then(res => {
                    this.setState({imageArr: imageArr.push(res.data)})
                })
                .finally(() => {
                    ++count;
                    if(images.length === count) {
                        this.setState({imageArr, isLoading: false});
                    }
                })
        });

    };

  render() {
    const onSubmit = formValue => {
        sendForm(formValue)
            .then(() => {
                this.setState({
                    cities: [],
                    preview: {},
                    isLoading: false,
                    imageArr: [],
                    city: null,
                    title: ''
                })
            })
    };

    return (
        <Styles>
          <Form
              onSubmit={onSubmit}
              mutators={{...arrayMutators }}
              initialValues={{
                  images: this.state.imageArr,
                  city: this.state.city,
                  title: this.state.title
              }}
              render={({ handleSubmit, form, submitting, pristine, values }) => (
                  <form onSubmit={handleSubmit}>
                      <div>
                          <label>Title</label>
                          <Field name="title">
                              {({ input, meta }) => (
                                  <React.Fragment>
                                      <input {...input} type="text" placeholder="Title" />
                                      <ErrorValidation {...meta}/>
                                  </React.Fragment>
                              )}
                          </Field>
                      </div>
                      <div>
                          <label>City</label>
                          <Field name="city" component="select">
                              <option />
                              {this.state.cities.length &&
                                this.state.cities.map(city => {
                                    return (<option key={city.id}>{city.title}</option>)
                                })
                              }
                          </Field>
                      </div>
                      <ReactDropzone onDrop={(images) => this.onDrop(images, values)} >
                          Drop your image here!
                      </ReactDropzone>
                      <div>
                          <FieldArray name="images">
                              {({ fields, meta })  => (
                                  <div>
                                      {fields.value.length ? fields.value.map((image, i) => (
                                          <img src={image.link} key={i} alt=""/>
                                      )) : ''}
                                      <ErrorValidation {...meta}/>
                                  </div>
                              )}
                          </FieldArray>
                      </div>

                      <div className="buttons">
                          <button type="submit" disabled={submitting || this.state.isLoading}>
                              Submit
                          </button>
                      </div>
                      {this.state.isLoading ? <span>Uploading...</span> : ''}
                  </form>
              )}
              validate={values => {
                  const errors = {};

                  if (!values.title) {
                      errors.title = 'Title is required';
                  }
                  if (!values.images.length) {
                      errors.images = 'Images is required';
                  }
                  return errors;
              }}
          />
        </Styles>
    );
  }
}

export default AddForm;
