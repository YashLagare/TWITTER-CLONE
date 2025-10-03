import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = ({authUser}) => {
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});
	const [errors, setErrors] = useState({});

	const {updateProfile, isUpdatingProfile} = useUpdateUserProfile();

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	//to provide loading state while updating profile
	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName,
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				newPassword: "",
				currentPassword: "",
			})
		}
	}, [authUser])

	
	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							let validationErrors = {};
							if (formData.newPassword && !formData.currentPassword) {
								validationErrors.currentPassword = "Current password is required";
							}
							if (formData.currentPassword && !formData.newPassword) {
								validationErrors.newPassword = "New password is required";
							}
							if (formData.newPassword && formData.newPassword.length < 6) {
								validationErrors.newPassword = "New password must be at least 6 characters";
							}
							if (Object.keys(validationErrors).length > 0) {
								setErrors(validationErrors);
								return;
							}
							setErrors({});
							updateProfile(formData);
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<div className='flex-1'>
								<input
									type='password'
									placeholder='Current Password'
									className='input border border-gray-700 rounded p-2 input-md w-full'
									value={formData.currentPassword}
									name='currentPassword'
									onChange={handleInputChange}
								/>
								{errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
							</div>
							<div className='flex-1'>
								<input
									type='password'
									placeholder='New Password'
									className='input border border-gray-700 rounded p-2 input-md w-full'
									value={formData.newPassword}
									name='newPassword'
									onChange={handleInputChange}
								/>
								{errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
							</div>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button className='btn btn-primary rounded-full btn-sm text-white'>
							{isUpdatingProfile ? "Updating..." : "Update"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;