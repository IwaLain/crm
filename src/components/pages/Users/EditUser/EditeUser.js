import React from 'react'
import { Button, Col, Form, FormGroup, Label, Row } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { alert } from '../../../../js/methods/alert';
import { user } from '../../../../js/api/user';
import { validation } from '../../../../js/methods/validation';
import FormUser from '../FormUser/FormUser';

export const EditeUserModal = ({currentUser, editeUser}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        reset,
    } = useForm( {
        defaultValues: {
            username: currentUser.username,
            email: currentUser.email,
            phone: currentUser.phone,
            role: currentUser.role
        }
    });

    const data = {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        trigger,
    }

    const onSubmit = (e) => {
        const data = {
            'username': e.username,
            'email': e.email,
            'phone': e.phone,
            'password': e.password
        }

        const role = {
            'roleName': e.role,
        }

        editeUser(currentUser.id, data)

        user.editeUser(currentUser.id, data)
        .then(data => {
            if(data.errors) {
                alert('error', data.errors)
            } else {
                alert('success', 'Edit User successful')
            }
        })

        user.editUserRole(currentUser.id, role)
        .then(data => console.log(data))
    };

    return (
        <div>
            <FormUser title='Edit User' onSubmit={onSubmit} data={data} />
        </div>
    )
}

export default EditeUserModal