import Reac, { useState } from 'react'
import { useForm } from 'react-hook-form'
import './Register.css'
import Buttoncomp from '../../components/Button/Buttoncomp'

function Register() {
    const [error, setError] = useState('')
    const { register, handleSubmit } = useForm()

    const onSubmit = (data) => {
        console.log(data)
    }

    return (

        <div className='flex flex-col items-center text-white' id="register">
            <p className='text-3xl font-bold tracking-widest'>Fill up the form to create Account</p>

            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-2/4 justify-center'>
                <div>
                    <label htmlFor="Fullname">Fullname: </label>
                    <input id="Fullname"
                        placeholder="Enter your fullname: "
                        {...register("fullname", {
                            required: true,
                        })} />
                </div>
                <div>
                    <label htmlFor="username">Username: </label>
                    <input type="text"
                        id='username'
                        
                        placeholder="Enter your username: "
                        {...register("username", {
                            required: true,

                        })}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input type='email'
                        id='email'
                      
                        placeholder='Enter your Email: '
                        {...register("email", {
                            required: true,
                            validate: {
                                matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Email address must be a valid address",
                            }
                        })}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password"
                      
                        id='Password'
                        placeholder='Enter your password'
                        {...register("password", { required: true })}
                    />
                </div>
                <div>
                    <label htmlFor="confirmpassword">Confirm Password: </label>
                    <input type="password"
                    id='confirmpassword'
                       
                        placeholder='Confirm your password'
                        {...register("confirmpassword", { required: true })}
                    />
                </div>

                <Buttoncomp type="submit">
                    Create Your Account
                </Buttoncomp>


            </form>

            <div>Already have an account? <Buttoncomp>Sign in</Buttoncomp></div>
        </div>
    )
}

export default Register
