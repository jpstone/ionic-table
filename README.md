# Introduction

Ionic directives (ion-list, ion-item) styled to mimick normal HTML tables for responsiveness and provide animation functionality.

## Codepen Demo

http://codepen.io/anon/pen/QjWxqG

# Installation

bower install ionic-table

# Usage

Include the ionic-table.js in your index.html file and be sure to inject "ionic-table" into your app.js.

# Markup

Below is a markup example in Jade:

```
ion-header-bar.bar-positive
  h1.title Table
ion-content
  .table(ion-table='')
    ion-list
      ion-item.table-head.table-row
        ul
          li One
          li Two
          li Three
      ion-item.table-row
        ul
          li
            | The li element will automatically resize to fit the data here as best as possible.
          li.table-select
            select
              option(disabled, selected) Chose
              option Yes
              option No
              option N/A
          li.table-select
            select
              option(disabled, selected) Choose
              option Yes
              option No
              option N/A
      ion-item.table-row
        ul
          li
            | More data
          li.table-select
            select
              option(disabled, selected) Chooooose
              option Yes
              option No
              option N/A
          li.table-select
            select
              option(disabled, selected) Choose
              option Yes
              option No
              option N/A
```

# Custom Styles

## `.table`

This is the container class for the entire table.

## `.table-row`

Identifies a new table row and should be placed ion the `<ion-item>` within an `<ion-list>`.

## `.table-head`

Specifies the table header (default background is gray and text is black/centered).

## `.table-select`

Extends ionic's `select` styles for use in a table. To be placed on the individual `li` table cell.

## `.icon-only`

Centers an icon vertically and horizontally for ng-click functionality. To be placed on an individual `li` table cell, inside which is an `i.icon.icon-whatever`.
