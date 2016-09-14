import Html exposing (..)
import Html.App as App

main = App.beginnerProgram { model = model, view = view, update = update }


-- Model

type alias Date = String

type alias Model = 
  { birthDate: Date
  , currentDate: Date
  , selectedDate: Date
  }

model : Model
model = Model "1990-07-04" "2016-09-13" "2016-09-13"


-- Update

type Msg = SelectDate Date

update : Msg -> Model -> Model
update msg model = case msg of
  SelectDate selectedDate -> { model | selectedDate = selectedDate}


-- View

view : Model -> Html Msg
view model = div [] [text ("Selected date: " ++ model.selectedDate)]
