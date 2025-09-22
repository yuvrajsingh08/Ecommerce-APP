import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { FaUserEdit, FaTrash, FaSyncAlt } from "react-icons/fa";
import ChangeUserRole from "../components/ChangeUserRole";
import {
  Table,
  Button,
  TextField,
  Badge,
  Flex,
  Spinner,
} from "@radix-ui/themes";

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const fetchData = await fetch(SummaryApi.allUser.url, {
        method: SummaryApi.allUser.method,
        credentials: "include",
      });

      const dataResponse = await fetchData.json();
      if (dataResponse.success) {
        setAllUsers(dataResponse.data);
      } else if (dataResponse.error) {
        toast.error(dataResponse.message);
      }
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      setLoading(true);
      const res = await fetch(`${SummaryApi.deleteUser.url}/${userId}`, {
        method: SummaryApi.deleteUser.method,
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) {
        toast.success("User deleted successfully");
        fetchAllUsers();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Error deleting user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Filter by search
  const filteredUsers = allUser.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      {/* Search and refresh */}
      <Flex justify="between" align="center" mb="3" wrap="wrap" gap="3">
        <TextField.Root
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "280px" }}
        />
        <Button
          onClick={fetchAllUsers}
          variant="soft"
          color="indigo"
          disabled={loading}
        >
          <FaSyncAlt className="mr-2" /> Refresh
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" className="h-40">
          <Spinner size="3" /> <span className="ml-2">Loading users...</span>
        </Flex>
      ) : (
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Sr.</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredUsers.map((el, index) => (
              <Table.Row key={el._id}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell className="font-medium">{el?.name}</Table.Cell>
                <Table.Cell>{el?.email}</Table.Cell>
                <Table.Cell>
                  <Badge
                    color={el?.role === "ADMIN" ? "crimson" : "gray"}
                    variant="soft"
                  >
                    {el?.role}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{formatDate(el?.createdAt)}</Table.Cell>
                <Table.Cell>
                  <Flex gap="2">
                    <Button
                      size="1"
                      variant="soft"
                      color="green"
                      onClick={() => {
                        setUpdateUserDetails(el);
                        setOpenUpdateRole(true);
                      }}
                      title="Edit Role"
                    >
                      <FaUserEdit />
                    </Button>
                    <Button
                      size="1"
                      variant="soft"
                      color="red"
                      onClick={() => handleDeleteUser(el._id)}
                      title="Delete User"
                    >
                      <FaTrash />
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      {openUpdateRole && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          userId={updateUserDetails._id}
          callFunc={fetchAllUsers}
        />
      )}
    </div>
  );
};

export default AllUsers;
