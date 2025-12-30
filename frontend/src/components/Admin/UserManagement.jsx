import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {deleteUser, addUser, updateUser, fetchUsers} from '../../redux/slices/adminSlice'

const UserManagement = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)
  
  const {users, loading, error} = useSelector((state)=> state.admin)

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate ("/")
    }
  }, [user, navigate])
  
  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(fetchUsers())
    }
  },[dispatch, user])

  // State for the new user form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // Default role
  });

  // Handler for all input changes in the form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handler for submitting the new user form
  const handleSubmit = (e) => {
    e.preventDefault();
 dispatch(addUser(formData))

    // Reset the form after submission
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
    });
  }; //

  // Handler for changing a user's role from the table dropdown
  const handleRoleChange = (userId, newRole) => {
  dispatch(updateUser({id: userId, role: newRole }))
  };

  // Handler for deleting a user
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId))
    }
  }; //

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      {loading && <p>Loading...</p> }
      {error && <p>Error: {error}</p> }
      {/* Add New User Form Section */}
      <div className="p-6 bg-white shadow-md rounded-lg mb-8">
        <h3 className="text-lg font-bold mb-4">Add New User</h3>

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>{' '}
          {/* */}
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>{' '}
          {/* */}
          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>{' '}
          {/* */}
          {/* Role Select Field */}
          <div className="mb-6">
            <label htmlFor="role" className="block text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="user">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>{' '}
          {/* */}
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
          >
            Add User
          </button>{' '}
          {/* */}
        </form>
      </div>
      {/* User List Management Table */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                  {user.name}
                </td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  {/* Role Change Dropdown */}
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="user">Customer</option>
                    <option value="admin">Admin</option>
                  </select>{' '}
                  {/* */}
                </td>
                <td className="p-4">
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>{' '}
                  {/* */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>{' '}
      {/* */}
    </div>
  );
};

export default UserManagement;
