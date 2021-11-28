defmodule PeekWeb.Resolvers.BookingResolver do
  alias Peek.Bookings

  def bookings(_, _, _) do
    {:ok, Bookings.list_bookings()}
  end

  def get_bookings(_, %{id: id}, _) do
    Bookings.get_bookings(id)
  end

  def create_booking(_, %{event_id: event_id, first_name: first_name, last_name: last_name}, _) do
    Bookings.create_booking(event_id, %{
      first_name: first_name,
      last_name: last_name
    })
  end
end
