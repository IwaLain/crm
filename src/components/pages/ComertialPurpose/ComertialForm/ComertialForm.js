import React from 'react'
import { Col, Form, FormGroup, Label, Row } from 'reactstrap'
import Profile from '../../../../js/api/profile'
import { validation } from '../../../../js/helpers/validation'

const ComertialForm = ({dataForm}) => {
    const 
    {   trigger, 
        errors, 
        register, 
        quote, 
        date, 
        handleSubmit,
        currentData
    } = dataForm

    const onSubmit = (e) => {
        const data = {
            'billTo': e.bill,
            'shipTo': e.ship,
            'expires': e.expires,
            'memo': e.memo,
            'date': date,
            'quote': quote,
            items: currentData
        }

        Profile.createPdf(data)
    }

    return (
        <Form id='form' onSubmit={handleSubmit(onSubmit)}>
            <Row className='purpose__form'>
                <Col lg={4} md={5} className='purpose__form-quote'>
                    <FormGroup className='purpose__quote'>
                        <Col>
                            <h3>
                                Quote #
                            </h3>
                        </Col>
                        <input
                            name='quote'
                            type='text'
                            disabled
                            className="ui-kit__input"
                            {...register('quote')}
                        />
                    </FormGroup> 
                    <FormGroup className='purpose__ship'>
                        <Label>
                            Bill to
                        </Label>
                        <textarea
                            name='bill'
                            type='text'
                            className={`ui-kit__textarea form-control ${errors.bill ? 'is-invalid' : ''}`}
                            {...register('bill', validation('address'))}
                            onKeyUp={() => {
                                trigger('bill')
                            }}
                        />
                        <Label>
                            Ship to
                        </Label>
                        <textarea
                            name='ship'
                            type='text'
                            className={`ui-kit__textarea form-control ${errors.ship ? 'is-invalid' : ''}`}
                            {...register('ship', validation('address'))}
                            onKeyUp={() => {
                                trigger('ship')
                            }}
                        />
                    </FormGroup>
                </Col>
                <Col lg={{offset:1, size:4}} md={5} className="purpose__description">
                    <Row className='purpose__info'>
                        <Col>
                            <Label>
                                    Date
                            </Label>
                        </Col>
                        {date}
                    </Row>
                    <Row className='purpose__info my-2'>
                        <Col>
                            <Label>
                                Expires
                            </Label>
                        </Col>
                        <input
                            name='expires'
                            type='text'
                            className={`ui-kit__textarea form-control ${errors.expires ? 'is-invalid' : ''}`}
                            {...register('expires', validation('text'))}
                            onKeyUp={() => {
                                trigger('expires')
                            }}
                        />
                    </Row>
                    <Row className='purpose__info'>
                        <Col>
                            <Label>
                                Memo
                            </Label>
                        </Col>
                        <input
                            name='memo'
                            type='text'
                            className={`ui-kit__textarea form-control ${errors.memo ? 'is-invalid' : ''}`}
                            {...register('memo', validation('text'))}
                            onKeyUp={() => {
                                trigger('memo')
                            }}
                        />
                    </Row>
                </Col>
            </Row>
        </Form>
    )
}

export default ComertialForm


